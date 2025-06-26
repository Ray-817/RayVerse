const mongoose = require("mongoose");
const slugify = require("slugify");

const validator = require("validator");

const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
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
    mockContent: {
      en: {
        type: String,
        required: [true, "Article should has content."],
      },
      jp: {
        type: String,
        required: [true, "Article should has content."],
      },
    },
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
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    visible: { type: Boolean, default: true },
    categories: {
      type: [String],
      required: [true, "Article should has category."],
      enum: ["technology", "art", "poetry", "life"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedByIPs: { type: [String] },
  },
  { timestamps: true }
);

// 在 slug 字段上创建索引以提高查询性能
// articleSchema.index({ slug: 1 });
// 在 language 和 categories 字段上创建复合索引以提高过滤性能
// articleSchema.index({ language: 1, categories: 1 });

// adding slug to the model
articleSchema.pre("save", function (next) {
  this.slug = slugify(this.title.en.split(":")[0].trim(), { lower: true });

  // if (!this.slug || this.isModified("title.en")) {
  //   const baseTitle = this.title.en.split(":")[0].trim();
  //   this.slug = slugify(baseTitle, { lower: true });
  // }
  next();
});

module.exports = mongoose.model("Article", articleSchema);
