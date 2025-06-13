const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    description: {
      type: String,
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

module.exports = mongoose.model("Image", imageSchema);
