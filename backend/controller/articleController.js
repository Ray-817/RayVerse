const Article = require("../models/articleModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const { getR2PresignedUrl } = require("../utils/r2Client");
const { r2UrlAccessLimiter } = require("../middlewares/rateLimiter");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

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
  catchAsync(async (req, res) => {
    const { slug } = req.params; // 从 URL 参数中获取 slug
    const { lang } = req.query; // 从查询参数中获取语言

    if (!lang) {
      return next(new AppError("Language parameter (lang) is required.", 400));
    }

    // 查找文章，并确保包含 contentUrl 字段，因为它是多语言对象
    const article = await Article.findOne({ slug: slug });

    if (!article) {
      return next(new AppError(`Article with slug "${slug}" not found.`, 404));
    }

    // 根据请求的语言从 contentUrl 对象中选择正确的 R2 Key
    const r2KeyForMarkdown = article.contentUrl
      ? article.contentUrl[lang]
      : undefined;

    if (!r2KeyForMarkdown) {
      // 如果该语言的 contentUrl 不存在，可以返回 404 或回退到默认语言
      // 这里我们选择返回 404，或者你可以在前端处理回退语言的逻辑
      return next(
        new AppError(
          `No content available for language "${lang}" for article "${slug}".`,
          404
        )
      );
    }

    // 生成 Markdown 文件的预签名 URL
    const markdownUrl = await getR2PresignedUrl(r2KeyForMarkdown);

    // 格式化返回给前端的文章数据
    const formattedArticle = {
      id: article._id,
      slug: article.slug,
      // 返回指定语言的标题和摘要
      title: article.title
        ? article.title[lang] || article.title["en"]
        : "No Title", // 处理 title 为空的情况
      summary: article.summary
        ? article.summary[lang] || article.summary["en"]
        : "No Summary", // 处理 summary 为空的情况
      markdownUrl: markdownUrl, // Markdown 文件的 URL
      publishedAt: article.publishedAt,
      likes: article.likes,
    };

    res.status(200).json(formattedArticle);
  }),
];
