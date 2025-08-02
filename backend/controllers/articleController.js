/**
 * @fileoverview Article Controllers: Handling all article-related API requests.
 */

const Article = require("../models/articleModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const { getR2PresignedUrl } = require("../utils/r2Client");
const { r2UrlAccessLimiter } = require("../middlewares/rateLimiter");

/**
 * @description Get all Articles: Supports paging, filtering, sorting, and field selection.
 * @route GET /api/v1/articles
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {object} A JSON response containing the article data and pagination info.
 */
exports.getAllArticles = catchAsync(async (req, res) => {
  // 1. First, calculate the total number of articles before applying pagination.
  //    This query will only be filtered, but not sorted or paginated.
  const totalArticlesQuery = new APIFeatures(
    Article.find(),
    req.query
  ).filter();
  const totalArticles = await totalArticlesQuery.query.countDocuments();

  // 2. Next, fetch the actual article data with all query features applied.
  const features = new APIFeatures(Article.find(), req.query)
    .filter() // Apply filtering (e.g., by categories)
    .sort() // Apply sorting
    .limitFields() // Select specific fields based on the query (e.g., title.<lang>, summary.<lang>)
    .paginate(); // Apply pagination

  // Execute the query to get the articles for the current page.
  const articles = await features.query;

  // 3. Handle cases where no articles are found.
  if (!articles) {
    return next(new AppError("Articles Not found!"), 404);
  }
  // 4. Calculate pagination details for the response.
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || process.env.PAGINATION_PAGE;
  const totalPages = Math.ceil(totalArticles / limit);

  // Send a successful response with the data and pagination info.
  res.status(200).json({
    status: "success",
    results: articles.length,
    articles,
    currentPage: page,
    totalPages,
    totalArticles,
  });
});

/**
 * @description Create a new article.
 * @route POST /api/v1/articles
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} JSON response with the newly created article.
 */
exports.createArticle = catchAsync(async (req, res) => {
  // Create a new article in the database using data from the request body.
  const newArticle = await Article.create(req.body);

  // Send a success response with a 201 status code and the new article data.
  res.status(201).json({
    status: "success",
    data: {
      newArticle,
    },
  });
});

/**
 * @description Get a single article by its URL slug. Fetches metadata from the database and content from R2 storage.
 * @route GET /api/v1/articles/slug/:slug
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - The next middleware function.
 * @param {string} slug - The URL slug of the article.
 * @param {string} lang - The language of the article content.
 * @returns {object} A JSON response containing the formatted article data with its content.
 */
exports.getSingleArticleBySlug = [
  r2UrlAccessLimiter,
  catchAsync(async (req, res, next) => {
    // 1. Validate required parameters.
    const { slug } = req.params;
    const { lang } = req.query;

    if (!lang) {
      return next(new AppError("Language parameter (lang) is required.", 400));
    }

    // 2. Find the article in the database using the provided slug.
    const article = await Article.findOne({ slug: slug });

    // Handle case where no article is found.
    if (!article) {
      return next(new AppError(`Article with slug "${slug}" not found.`, 404));
    }

    // 3. Get the R2 key for the specific language and validate its existence.
    const r2KeyForMarkdown = article.contentUrl
      ? article.contentUrl[lang]
      : undefined;

    if (!r2KeyForMarkdown) {
      return next(
        new AppError(
          `No content available for language "${lang}" for article "${slug}".`,
          404
        )
      );
    }

    // 4. Generate a pre-signed URL and fetch the Markdown content from R2.
    const markdownUrl = await getR2PresignedUrl(
      r2KeyForMarkdown,
      process.env.EXPIRED_TIME
    );
    const markdownRes = await fetch(markdownUrl);

    // Handle cases where fetching from R2 fails.
    if (!markdownRes.ok) {
      console.error(
        `Backend failed to fetch markdown from R2: ${markdownRes.statusText}`
      );
      return next(
        new AppError(`Failed to load article content from storage.`, 500)
      );
    }
    const markdownContent = await markdownRes.text();

    // 5. Format the final article object for the response.
    const formattedArticle = {
      id: article._id,
      slug: article.slug,
      title: article.title
        ? article.title[lang] || article.title["en"]
        : "No Title",
      summary: article.summary
        ? article.summary[lang] || article.summary["en"]
        : "No Summary",
      content: markdownContent,
      publishedAt: article.publishedAt,
      likes: article.likes,
    };

    // 6. Send the successful response.
    res.status(200).json(formattedArticle);
  }),
];
