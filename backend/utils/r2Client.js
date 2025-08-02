/**
 * @fileoverview R2 Client: Configures the AWS S3 client for Cloudflare R2 and provides a function to generate pre-signed URLs.
 */
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/**
 * @description Initializes the AWS S3 Client for R2 storage.
 * @private
 */
const r2Client = new S3Client({
  region: "auto",
  // Construct the endpoint URL using the R2 account ID from environment variables.
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  // Use credentials from environment variables for authentication.
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

// The name of the R2 bucket, retrieved from environment variables.
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
// The validity time of the URL in seconds.
const EXPIRED_TIME = process.env.EXPIRED_TIME;
/**
 * @description Generates a pre-signed URL for an R2 object.
 * This URL allows temporary access to the object without needing permanent credentials.
 * @param {string} objectKey - The key of the object (file path and name) in the R2 bucket.
 * @param {number} expiresIn - The validity time of the URL.
 * @returns {Promise<string>} A promise that resolves to the pre-signed URL.
 */
exports.getR2PresignedUrl = async function getR2PresignedUrl(
  objectKey,
  expiresIn = EXPIRED_TIME
) {
  // Create a command to get the object from the specified bucket and key.
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: objectKey,
    // Set cache control headers to optimize browser caching.
    ResponseCacheControl: `max-age=${expiresIn}, public`,
  });

  // Use getSignedUrl to generate the pre-signed URL with the specified expiry time.
  const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn });
  return presignedUrl;
};
