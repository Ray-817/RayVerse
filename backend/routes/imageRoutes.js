/**
 * @fileoverview Image Routes: Defines all API routes for images.
 */
const express = require("express");
const imageController = require("../controllers/imageController");

// Create a new router instance.
const router = express.Router();

// Define a route to create a new image record.
router.route("/").post(imageController.createImage);

// Define a route to get all image thumbnails.
router.route("/thumbnails").get(imageController.getAllThumbnails);

// Define a route to get a single image by its URL slug.
router.route("/slug/:slug").get(imageController.getSingleImageBySlug);

// Export the router to be used by the main application.
module.exports = router;
