const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

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
  });
  const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn });
  return presignedUrl;
};
