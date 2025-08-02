/**
 * @fileoverview Video Routes: Defines all API routes for videos.
 */
const express = require("express");
const videoController = require("../controllers/videoController");

// Create a new router instance.
const router = express.Router();

// Define a single route for handling videos at the root path (e.g., /api/v1/videos).
router
  .route("/")
  // POST: Create a new video record.
  .post(videoController.createVideo)
  // GET: Get a list of all video data with pre-signed R2 URLs.
  .get(videoController.getVideos);

// Export the router to be used by the main application.
module.exports = router;
