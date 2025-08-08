/**
 * @fileoverview Image Model: Defines the schema and validation for image documents.
 * @description This schema includes fields for image metadata, URL validation, and automatic slug generation.
 */
const mongoose = require("mongoose");
const slugify = require("slugify");

/**
 * @description Defines the Mongoose schema for an Image.
 */
const imageSchema = new mongoose.Schema(
  {
    // The unique URL slug for the image, generated from its category and a timestamp.
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    // A brief description of the image.
    description: {
      type: String,
      trim: true,
    },
    // The R2 object key for the high-resolution image file.
    imageUrl: {
      type: String,
      required: [true, "Image should have a URL."],
    },
    // The R2 object key for the thumbnail image file.
    thumbnailUrl: {
      type: String,
      required: [true, "Image should have a thumbnail URL."],
    },
    // The category of the image, with a predefined set of values.
    category: {
      type: String,
      required: [true, "Image should have a category."],
      enum: ["photograph", "cover"],
    },
    // The number of likes the image has received.
    likes: {
      type: Number,
      default: 0,
    },
    // An array to store IP addresses that have liked the image to prevent duplicate likes.
    likedByIPs: { type: [String] },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to automatically generate a unique slug.
// The slug is generated from the category and a timestamp, ensuring uniqueness.
imageSchema.pre("save", function (next) {
  // Generate the slug only if the category is new or has been modified.
  if (this.isModified("category") || this.isNew) {
    const baseSlug = slugify(this.category, { lower: true, strict: true });
    this.slug = `${baseSlug}-${Date.now()}`;
  }
  next();
});

// Create and export the Mongoose model based on the schema.
module.exports = mongoose.model("Image", imageSchema);
