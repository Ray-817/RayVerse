const Image = require("../models/imageModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getR2PresignedUrl } = require("../utils/r2Client");
const { r2UrlAccessLimiter } = require("../middlewares/rateLimiter");

exports.getAllThumbnails = [
  r2UrlAccessLimiter, // 应用频率限制中间件
  catchAsync(async (req, res, next) => {
    // 假设你只获取 category 为 'photograph' 的图片作为缩略图展示
    const images = await Image.find({ category: "photograph" });

    // 如果没有找到任何图片，返回 404
    if (!images || images.length === 0) {
      // 更准确的错误信息
      return next(new AppError("No thumbnail images found.", 404));
    }

    // 使用 Promise.all 并行生成所有缩略图的预签名 URL
    const formattedImages = await Promise.all(
      images.map(async (image) => {
        // 确保 image.thumbnailUrl 是 R2 对象的 key (文件名)
        if (!image.thumbnailUrl) {
          console.warn(`Image ID ${image._id} missing thumbnailUrl key.`);
          return null; // 或者跳过，或者返回一个默认图片URL
        }

        const thumbnailUrl = await getR2PresignedUrl(
          image.thumbnailUrl,
          process.env.EXPIRED_TIME
        );

        return {
          id: image._id,
          slug: image.slug,
          description: image.description,
          thumbnailUrl: thumbnailUrl, // 现在是完整的预签名 URL
        };
      })
    );

    // 过滤掉因为缺少 thumbnailUrl 而返回 null 的项（如果选择了这种处理方式）
    const validFormattedImages = formattedImages.filter((img) => img !== null);

    // 成功获取数据，状态码 200 OK
    res.status(200).json(validFormattedImages);
  }),
];

exports.createImage = catchAsync(async (req, res) => {
  const newImage = await Image.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newImage,
    },
  });
});

exports.getSingleImageBySlug = [
  r2UrlAccessLimiter,
  catchAsync(async (req, res, next) => {
    // 确保 next 参数传入
    const { slug } = req.params;

    const image = await Image.findOne({ slug: slug });

    if (!image) {
      return next(new AppError(`Image with slug "${slug}" not found.`, 404));
    }

    // 假设 image.imageUrl 存储高清图的 R2 key
    const imageUrl = await getR2PresignedUrl(
      image.imageUrl,
      process.env.EXPIREDD_TIME
    );

    const formattedImage = {
      id: image._id,
      title: image.title,
      slug: image.slug,
      description: image.description,
      imageUrl: imageUrl,
    };

    res.status(200).json(formattedImage);
  }),
];
