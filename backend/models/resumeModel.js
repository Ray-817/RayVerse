/**
 * @fileoverview Resume Model: Defines the schema and validation for resume documents.
 * @description This schema stores the R2 object key and language for each resume version.
 */
const mongoose = require("mongoose");
const validator = require("validator");

/**
 * @description Defines the Mongoose schema for a Resume.
 */
const resumeSchema = new mongoose.Schema(
  {
    // The R2 object key for the resume file.
    resumeUrl: {
      type: String,
      required: [true, "Resume must have a URL."],
      // Validate that the provided string is a valid URL format.
      validate: [validator.isURL, "Resume URL must be a valid URL."],
    },
    // The language of the resume, ensuring it's one of the allowed values and unique.
    language: {
      type: String,
      required: [true, "Resume must have a language."],
      enum: ["en", "jp", "zhHans"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Mongoose model based on the schema.
module.exports = mongoose.model("Resume", resumeSchema);
