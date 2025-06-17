const Article = require("../models/articleModel");
const catchAsync = require("../util/catchAsync");
const APIFeatures = require("../util/apiFeatures");

exports.getAllArticles = catchAsync(async (req, res) => {
  const PAGINATION_PAGE = 4;
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
  const limit = parseInt(req.query.limit) || PAGINATION_PAGE;
  const totalPages = Math.ceil(totalArticles / limit);

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

exports.getArticle = () => {
  console.log(`getArticle`);
};
