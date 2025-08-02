/**
 * @fileoverview Article Routes: Defines all API routes for articles.
 */
const express = require("express");
const articleController = require("../controllers/articleController");

// Create a new router instance.
const router = express.Router();

// Define routes for the root path (e.g., /api/v1/articles).
router
  .route("/")
  // GET: Get a list of all articles with filtering, sorting, and pagination.
  .get(articleController.getAllArticles)
  // POST: Create a new article.
  .post(articleController.createArticle);

// Define a route to get a single article by its URL slug.
router.route("/slug/:slug").get(articleController.getSingleArticleBySlug);

// Export the router to be used by the main application.
module.exports = router;
