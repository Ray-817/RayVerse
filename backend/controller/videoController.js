const Video = require("../models/videoModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getR2PresignedUrl } = require("../utils/r2Client");

exports.createVideo = catchAsync(async (req, res) => {
  const newVideo = await Video.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newVideo,
    },
  });
});

exports.getVideos = catchAsync(async (req, res, next) => {
  const videos = await Video.find({});

  // 1. 修正空数组检查的逻辑
  // 如果没有找到任何视频（即返回空数组），通常返回 200 OK 和一个空数据列表
  if (videos.length === 0) {
    return res.status(200).json({
      // 立即返回，阻止后续代码执行
      status: "success",
      results: 0,
      data: {
        videos: [], // 返回空数组
      },
    });
  }

  // 2. 将生成预签名 URL 的逻辑放入 try-catch 块中
  // 虽然 catchAsync 会捕获，但在这里捕获可以更细致地处理 Promise.all 内部的特定错误，
  // 避免一个 R2 错误导致整个 Promise.all 失败。
  // 但是，如果您的全局错误处理器足够通用，也可以依赖 catchAsync。
  // 考虑到您遇到的 ERR_HTTP_HEADERS_SENT，我们主要关注确保只发送一次响应。

  let videoData;
  try {
    videoData = await Promise.all(
      videos.map(async (video) => {
        // 确保您的 Mongoose 模型中字段名与此匹配，例如 videoKey 和 coverKey
        const videoUrl = await getR2PresignedUrl(video.videoUrl, 7200);
        const posterUrl = await getR2PresignedUrl(video.coverUrl, 86400);

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
    // 如果在生成预签名 URL 过程中发生错误，将错误传递给下一个中间件
    // 这将由 catchAsync 捕获并传递给全局错误处理器
    return next(
      new AppError(`Failed to generate video URLs: ${error.message}`, 500)
    );
  }

  // 3. 只有在所有操作成功后才发送成功响应
  res.status(200).json({
    status: "success",
    results: videoData.length,
    videos: videoData,
  });
});
