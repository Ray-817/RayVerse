/**
 * @fileoverview Video Controllers: Handling all video-related API requests.
 */
const Video = require("../models/videoModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getR2PresignedUrl } = require("../utils/r2Client");
const { r2UrlAccessLimiter } = require("../middlewares/rateLimiter");

/**
 * @description Get all video records. Generates pre-signed URLs for video and poster files from R2.
 * @route GET /api/v1/videos
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {object} A JSON response containing a list of video data with their URLs.
 */
exports.getVideos = [
  r2UrlAccessLimiter,
  catchAsync(async (req, res, next) => {
    // 1. Find all video records from the database.
    const videos = await Video.find({});

    // 2. If no videos are found, return an empty array with a 200 status code.
    if (videos.length === 0) {
      return res.status(200).json({
        status: "success",
        results: 0,
        data: {
          videos: [],
        },
      });
    }

    let videoData;

    // 3. Concurrently generate pre-signed URLs for each video and poster.
    videoData = await Promise.all(
      videos.map(async (video) => {
        const videoUrl = await getR2PresignedUrl(
          video.videoUrl,
          process.env.EXPIRED_TIME
        );
        const posterUrl = await getR2PresignedUrl(
          video.coverUrl,
          process.env.EXPIRED_TIME
        );

        return {
          id: video._id,
          title: video.title,
          videoUrl,
          posterUrl,
          description: video.description,
        };
      })
    );

    // 4. Handle errors during URL generation.
    if (!videoData) {
      return next(
        new AppError(`Failed to generate video URLs: ${error.message}`, 500)
      );
    }

    // 5. Send a success response with the formatted video data.
    res.status(200).json({
      status: "success",
      results: videoData.length,
      videos: videoData,
    });
  }),
];

/**
 * @description Create a new video record in the database.
 * @route POST /api/v1/videos
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} JSON response with the newly created video record.
 */
exports.createVideo = catchAsync(async (req, res) => {
  // Create a new video record in the database using data from the request body.
  const newVideo = await Video.create(req.body);

  // Send a success response with a 201 status code and the new video data.
  res.status(201).json({
    status: "success",
    data: {
      newVideo,
    },
  });
});
