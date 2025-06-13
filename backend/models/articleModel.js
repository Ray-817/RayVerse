const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Article should has its slug."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Article should has title."],
      trim: true,
    },
    summary: { type: String, trim: true },
    contentUrl: {
      type: String,
      required: [true, "Article should has cloudflare URL."],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    language: { type: String, enum: ["zh", "jp", "en"], default: "jp" },
    visible: { type: Boolean, default: true },
    categories: {
      type: [String],
      required: true,
      enum: ["technology", "art", "poetry", "life"],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 在 slug 字段上创建索引以提高查询性能
// articleSchema.index({ slug: 1 });
// 在 language 和 categories 字段上创建复合索引以提高过滤性能
// articleSchema.index({ language: 1, categories: 1 });

module.exports = mongoose.model("Article", articleSchema);
