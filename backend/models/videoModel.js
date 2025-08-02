/**
 * @fileoverview Video Model: Defines the schema and validation for video documents.
 * @description This schema stores the metadata, URLs, and engagement metrics for each video.
 */
const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

/**
 * @description Defines the Mongoose schema for a Video.
 */
const videoSchema = new mongoose.Schema(
  {
    // The unique URL slug for the video, automatically generated from the title.
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    // The title of the video, which is a required field.
    title: {
      type: String,
      required: [true, "Video must have a title."],
      trim: true,
    },
    // A brief description of the video.
    description: {
      type: String,
      trim: true,
    },
    // The R2 object key for the video file. Validated as a URL.
    videoUrl: {
      type: String,
      required: [true, "Video must have a URL."],
      validate: [validator.isURL, "Video URL must be a valid URL."],
    },
    // The R2 object key for the video's cover image. Validated as a URL.
    coverUrl: {
      type: String,
      required: [true, "Video must have a cover URL."],
      validate: [validator.isURL, "Cover URL must be a valid URL."],
    },
    // The number of likes the video has received.
    likes: {
      type: Number,
      default: 0,
    },
    // An array to store IP addresses that have liked the video to prevent duplicate likes.
    likedByIPs: { type: [String] },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to automatically generate a unique URL slug from the video title.
// Spaces in the title are replaced with hyphens.
videoSchema.pre("save", function (next) {
  this.slug = slugify(this.title.replace(" ", "-"), { lower: true });
  next();
});

// Create and export the Mongoose model based on the schema.
module.exports = mongoose.model("Video", videoSchema);
