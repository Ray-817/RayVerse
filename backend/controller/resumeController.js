const Resume = require("../models/resumeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getR2PresignedUrl } = require("../utils/r2Client");

exports.getResume = catchAsync(async (req, res, next) => {
  const lang = req.query.lang || "en"; // 获取语言参数，默认为 'en'

  // 1. 从数据库获取对应的 R2 对象键
  const resumeData = await Resume.findOne({ language: lang });

  console.log(req.query);

  if (!resumeData || !resumeData.resumeUrl) {
    return next(
      new AppError("Resume object key not found for this language."),
      404
    );
  }

  const objectKey = resumeData.resumeUrl;

  // 2. 调用工具函数生成预签名 URL
  const presignedUrl = await getR2PresignedUrl(objectKey);

  // 3. 将预签名 URL 返回给前端
  res.status(200).json({ status: "success", url: presignedUrl });
});

exports.createResume = catchAsync(async (req, res) => {
  const newResume = await Resume.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newResume,
    },
  });
});
