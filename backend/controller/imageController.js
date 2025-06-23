const Image = require("../models/imageModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getR2PresignedUrl } = require("../utils/r2Client");

exports.getAllThumbnails = catchAsync(async (req, res, next) => {
  const images = await Image.find({ category: "photograph" }); // 获取所有图片元数据

  if (!images) {
    return next(new AppError("Thumbnail image not found."), 404);
  }

  // 映射数据，添加缩略图和大图的完整 URL
  const formattedImages = await Promise.all(
    images.map(async (image) => {
      // 确保 thumbnailUrl 和 imageUrl 字段在 image 对象上存在
      // 这里的 image.thumbnailUrl 和 image.imageUrl 应该是 R2 的 key (文件名)
      // 而不是完整的 URL，因为 getR2PresignedUrl 需要的是 key
      const thumbnailUrl = await getR2PresignedUrl(image.thumbnailUrl); // 注意：这里应该是 R2 key

      return {
        id: image._id,
        slug: image.slug,
        description: image.description,
        thumbnailUrl: thumbnailUrl,
      };
    })
  );

  // 注意：这里应该是 200 OK，因为你是成功获取了数据
  res.status(200).json(formattedImages);
});

exports.createImage = catchAsync(async (req, res) => {
  const newImage = await Image.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newImage,
    },
  });
});

exports.getSingleImageBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;

  // 2. 使用 slug 从 MongoDB 数据库中查询对应的图片文档
  const image = await Image.findOne({ slug: slug });

  // 3. 处理图片未找到的情况
  if (!image) {
    // 使用 AppError 抛出 404 错误
    return next(new AppError(`Image with slug "${slug}" not found.`, 404));
  }

  // 4. 构造高清图片和缩略图的预签名 URL
  // 假设你的 Image Model 中存储 R2 key 的字段是 r2Key 和 thumbnailR2Key
  const imageUrl = await getR2PresignedUrl(image.imageUrl); // 高清图 URL

  // 5. 准备响应数据
  const formattedImage = {
    id: image._id,
    title: image.title,
    slug: image.slug,
    description: image.description,
    imageUrl: imageUrl, // 返回高清图片 URL
  };

  // 6. 将数据作为 JSON 响应返回给前端
  // 成功获取单个资源，状态码为 200 OK
  res.status(200).json(formattedImage);
});
