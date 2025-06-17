const Article = require("../models/articleModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
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

exports.getArticle = catchAsync(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new AppError("No article found with that ID"), 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      article,
    },
  });
});
