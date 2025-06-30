const Video = require("../models/videoModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getR2PresignedUrl } = require("../utils/r2Client");
const { r2UrlAccessLimiter } = require("../middlewares/rateLimiter");

exports.createVideo = catchAsync(async (req, res) => {
  const newVideo = await Video.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newVideo,
    },
  });
});

exports.getVideos = [
  r2UrlAccessLimiter,
  catchAsync(async (req, res, next) => {
    const videos = await Video.find({});

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
    try {
      videoData = await Promise.all(
        videos.map(async (video) => {
          // 统一 videoUrl 和 posterUrl 的有效期为 24 小时 (86400 秒)
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
    } catch (error) {
      return next(
        new AppError(`Failed to generate video URLs: ${error.message}`, 500)
      );
    }

    res.status(200).json({
      status: "success",
      results: videoData.length,
      videos: videoData, // 注意这里的键名是 'videos'
    });
  }),
];
