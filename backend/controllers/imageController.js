/**
 * @fileoverview Image Controllers: Handling all image-related API requests.
 */
const Image = require("../models/imageModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getR2PresignedUrl } = require("../utils/r2Client");
const { r2UrlAccessLimiter } = require("../middlewares/rateLimiter");

/**
 * @description Get all photograph thumbnails.
 * @route GET /api/v1/images/thumbnails
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {object} A JSON array of formatted thumbnail data.
 */
exports.getAllThumbnails = [
  r2UrlAccessLimiter, // Apply rate limiting middleware.
  catchAsync(async (req, res, next) => {
    // 1. Find all images with the category "photograph".
    const images = await Image.find({ category: "photograph" });

    // Handle case where no images are found.
    if (!images || images.length === 0) {
      return next(new AppError("No thumbnail images found.", 404));
    }

    // 2. Concurrently generate pre-signed URLs for each thumbnail using Promise.all.
    const formattedImages = await Promise.all(
      images.map(async (image) => {
        // Validate if the thumbnailUrl key exists before generating a URL.
        if (!image.thumbnailUrl) {
          console.warn(`Image ID ${image._id} missing thumbnailUrl key.`);
          return null; // Return null for invalid images.
        }

        const thumbnailUrl = await getR2PresignedUrl(
          image.thumbnailUrl,
          process.env.EXPIRED_TIME
        );

        return {
          id: image._id,
          slug: image.slug,
          description: image.description,
          thumbnailUrl: thumbnailUrl, // The full pre-signed URL.
        };
      })
    );

    // 3. Filter out any images that were skipped due to missing thumbnail URLs.
    const validFormattedImages = formattedImages.filter((img) => img !== null);

    // Send a success response with a 200 status code and the formatted image data.
    res.status(200).json(validFormattedImages);
  }),
];

/**
 * @description Create a new image record in the database.
 * @route POST /api/v1/images
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} JSON response with the newly created image record.
 */
exports.createImage = catchAsync(async (req, res) => {
  // Create a new image in the database using data from the request body.
  const newImage = await Image.create(req.body);

  // Send a success response with a 201 status code and the new image data.
  res.status(201).json({
    status: "success",
    data: {
      newImage,
    },
  });
});

/**
 * @description Get a single image by its URL slug.
 * @route GET /api/v1/images/slug/:slug
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {object} A JSON response containing the formatted image data with its content.
 */
exports.getSingleImageBySlug = [
  r2UrlAccessLimiter,
  catchAsync(async (req, res, next) => {
    // 1. Get the slug from request parameters.
    const { slug } = req.params;

    // 2. Find the image in the database using the slug.
    const image = await Image.findOne({ slug: slug });

    // Handle case where no image is found.
    if (!image) {
      return next(new AppError(`Image with slug "${slug}" not found.`, 404));
    }

    // 3. Generate a pre-signed URL for the high-resolution image from R2.
    const imageUrl = await getR2PresignedUrl(
      image.imageUrl,
      process.env.EXPIREDD_TIME
    );

    // 4. Format the final image object for the response.
    const formattedImage = {
      id: image._id,
      title: image.title,
      slug: image.slug,
      description: image.description,
      imageUrl: imageUrl, // The full pre-signed URL.
    };

    // 5. Send the successful response.
    res.status(200).json(formattedImage);
  }),
];
