const Article = require("../models/articleModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const { getR2PresignedUrl } = require("../utils/r2Client");
const { r2UrlAccessLimiter } = require("../middlewares/rateLimiter");

exports.getAllArticles = catchAsync(async (req, res) => {
  // 1. 用于计算总文章数 (不应用分页和字段选择)
  // 这里我们只需要过滤，因为 countDocuments 只需要知道筛选条件
  const totalArticlesQuery = new APIFeatures(
    Article.find(),
    req.query
  ).filter();
  const totalArticles = await totalArticlesQuery.query.countDocuments();

  // 2. 用于获取实际的文章数据 (应用所有查询特性)
  const features = new APIFeatures(Article.find(), req.query)
    .filter() // 应用过滤条件 (categories)
    .sort() // 应用排序
    .limitFields() // 应用字段选择 (根据语言选择 title.<lang> 和 summary.<lang>，以及 categories)
    .paginate(); // 应用分页

  // 执行查询，获取文章数据
  const articles = await features.query;

  // 根据当前页和每页限制计算总页数
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || process.env.PAGINATION_PAGE;
  const totalPages = Math.ceil(totalArticles / limit);

  if (!articles) {
    return next(new AppError("Articles Not found!"), 404);
  }

  // 发送成功响应
  res.status(200).json({
    status: "success",
    results: articles.length, // 返回当前页的文章数量
    articles, // 文章数据
    currentPage: page, // 当前页码
    totalPages, // 总页数
    totalArticles, // 总文章数
  });
});

exports.createArticle = catchAsync(async (req, res) => {
  const newArticle = await Article.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newArticle,
    },
  });
});

exports.getSingleArticleBySlug = [
  r2UrlAccessLimiter,
  catchAsync(async (req, res, next) => {
    // 确保 next 参数存在
    const { slug } = req.params;
    const { lang } = req.query;

    if (!lang) {
      return next(new AppError("Language parameter (lang) is required.", 400));
    }

    const article = await Article.findOne({ slug: slug });

    if (!article) {
      return next(new AppError(`Article with slug "${slug}" not found.`, 404));
    }

    const r2KeyForMarkdown = article.contentUrl
      ? article.contentUrl[lang]
      : undefined;

    console.log("lang ===>", lang, typeof lang);
    console.log(
      "Object.keys(contentUrl) ===>",
      Object.keys(article.contentUrl)
    );
    console.log("是否匹配 zhHans:", lang === "zhHans");

    if (!r2KeyForMarkdown) {
      return next(
        new AppError(
          `No content available for language "${lang}" for article "${slug}".`,
          404
        )
      );
    }

    // 这里是关键修改：后端现在直接从 R2 获取 Markdown 文本
    const markdownUrl = await getR2PresignedUrl(
      r2KeyForMarkdown,
      process.env.EXPIRED_TIME
    );
    const markdownRes = await fetch(markdownUrl);

    if (!markdownRes.ok) {
      // 如果后端从R2获取失败，这里可以返回错误
      console.error(
        `Backend failed to fetch markdown from R2: ${markdownRes.statusText}`
      );
      return next(
        new AppError(`Failed to load article content from storage.`, 500)
      );
    }
    const markdownContent = await markdownRes.text();

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

    res.status(200).json(formattedArticle);
  }),
];
