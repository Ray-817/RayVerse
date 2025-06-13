const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    resumeUrl: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["en", "jp"],
      unique: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// 在 language 字段上创建索引
// resumeSchema.index({ language: 1 });

module.exports = mongoose.model("Resume", resumeSchema);
