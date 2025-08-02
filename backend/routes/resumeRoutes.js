/**
 * @fileoverview Resume Routes: Defines all API routes for resumes.
 */
const express = require("express");
const resumeController = require("../controllers/resumeController");

// Create a new router instance.
const router = express.Router();

// Define a single route for handling resumes at the root path (e.g., /api/v1/resume).
router
  .route("/")
  // GET: Get the pre-signed URL for a resume based on language.
  .get(resumeController.getResume)
  // POST: Create a new resume record.
  .post(resumeController.createResume);

// Export the router to be used by the main application.
module.exports = router;
