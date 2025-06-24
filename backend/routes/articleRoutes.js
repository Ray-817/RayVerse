const express = require("express");
const articleController = require("../controller/articleController");

const router = express.Router();

router
  .route("/")
  .get(articleController.getAllArticles)
  .post(articleController.createArticle);

router.route("/slug/:slug").get(articleController.getSingleArticleBySlug);

module.exports = router;
