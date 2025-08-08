/**
 * @fileoverview Article Model: Defines the schema and validation for article documents.
 * @description This schema includes multilingual fields, content URL validation, and automatic slug generation.
 */
const mongoose = require("mongoose");
const slugify = require("slugify");

/**
 * @description Defines the Mongoose schema for an Article.
 */
const articleSchema = new mongoose.Schema(
  {
    // The unique URL slug for the article, generated from the English title.
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    // Multilingual titles for the article.
    title: {
      en: {
        type: String,
        required: [true, "Article should has title."],
        trim: true,
      },
      jp: {
        type: String,
        required: [true, "Article should has title."],
        trim: true,
      },
      zhHans: {
        type: String,
        required: [true, "Article should has title."],
        trim: true,
      },
    },
    // Multilingual summaries for the article.
    summary: {
      en: {
        type: String,
        required: [true, "Article should has summary."],
        trim: true,
      },
      jp: {
        type: String,
        required: [true, "Article should has summary."],
        trim: true,
      },
      zhHans: {
        type: String,
        required: [true, "Article should has summary."],
        trim: true,
      },
    },
    // Multilingual R2 object keys for the article's Markdown content.
    contentUrl: {
      en: {
        type: String,
        required: [true, "Article should has URL."],
        trim: true,
      },
      jp: {
        type: String,
        required: [true, "Article should has URL."],
        trim: true,
      },
      zhHans: {
        type: String,
        required: [true, "Article should has URL."],
        trim: true,
      },
    },
    // The timestamp when the article was published.
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    // A flag to control the article's visibility.
    visible: { type: Boolean, default: true },
    // An array of categories for the article, with a predefined set of values.
    categories: {
      type: [String],
      required: [true, "Article should has category."],
      enum: ["technology", "art", "poetry", "life"],
    },
    // The number of likes the article has received.
    likes: {
      type: Number,
      default: 0,
    },
    // An array to store IP addresses that have liked the article to prevent duplicate likes.
    likedByIPs: { type: [String] },
  },
  { timestamps: true }
);

// Pre-save middleware to automatically generate a URL slug from the English title.
// The slug is derived from the part of the title before the first colon, if present.
articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title.en.split(":")[0].trim(), { lower: true });
  next();
});

// Create and export the Mongoose model based on the schema.
module.exports = mongoose.model("Article", articleSchema);
