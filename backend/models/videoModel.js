const mongoose = require("mongoose");

const validator = require("validator");

const videoSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    coverUrl: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedByIPs: { type: [String] },
  },
  {
    timestamps: true,
  }
);

// adding slug to the model
videoSchema.pre("save", function (next) {
  this.slug = slugify(this.title.replace(" ", "-"), { lower: true });
  next();
});

module.exports = mongoose.model("Video", videoSchema);
