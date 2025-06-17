const mongoose = require("mongoose");
const slugify = require("slugify");

const validator = require("validator");

const imageSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["baking", "diy", "photograph", "cover"],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 在 category 字段上创建索引
// imageSchema.index({ category: 1 });
// adding slug to the model

imageSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    const baseSlug = slugify(this.category, { lower: true, strict: true });
    this.slug = `${baseSlug}-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model("Image", imageSchema);
