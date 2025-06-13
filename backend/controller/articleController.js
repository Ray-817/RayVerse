const Article = require("../models/articleModel");
const catchAsync = require("../util/catchAsync");

exports.getAllArticles = () => {
  console.log(`getAllArticles`);
};

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

exports.updateArticle = () => {
  console.log(`updateArticle`);
};

exports.deleteArticle = () => {
  console.log(`deleteArticle`);
};
