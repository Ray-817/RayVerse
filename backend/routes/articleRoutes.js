const express = require("express");
const articleController = require("../controller/articleController");

const router = express.Router();

router
  .route("/")
  .get(articleController.getAllArticles)
  .post(articleController.postArticle);
router
  .route("/:id")
  .get(articleController.getArticle)
  .patch(articleController.updateArticle)
  .delete(articleController.deleteArticle);

module.exports = router;
