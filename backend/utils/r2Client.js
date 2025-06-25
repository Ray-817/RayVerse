const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

/**
 * 生成 R2 对象的预签名 URL
 * @param {string} objectKey R2 存储桶中的对象键 (文件路径和名称)
 * @param {number} expiresIn URL 的有效时间 (秒), 默认为 3600 秒 (1小时)
 * @returns {Promise<string>} 预签名 URL
 */
exports.getR2PresignedUrl = async function getR2PresignedUrl(
  objectKey,
  expiresIn = 3600
) {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: objectKey,
    ResponseCacheControl: `max-age=${expiresIn}, public`,
  });
  const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn });
  return presignedUrl;
};
