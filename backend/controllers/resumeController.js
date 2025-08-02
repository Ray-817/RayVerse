/**
 * @fileoverview Resume Controllers: Handling all resume-related API requests.
 */
const Resume = require("../models/resumeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { getR2PresignedUrl } = require("../utils/r2Client");
const { r2UrlAccessLimiter } = require("../middlewares/rateLimiter");

/**
 * @description Get a pre-signed URL for a resume PDF based on language.
 * @route GET /api/v1/resume
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - The next middleware function.
 * @param {string} [lang='en'] - The language of the resume. Defaults to 'en'.
 * @returns {object} JSON response containing the pre-signed URL.
 */
exports.getResume = [
  r2UrlAccessLimiter,
  catchAsync(async (req, res, next) => {
    // 1. Get the language parameter from the query, defaulting to 'en'.
    const lang = req.query.lang || "en";

    // 2. Find the R2 object key for the specified language in the database.
    const resumeData = await Resume.findOne({ language: lang });

    // Handle case where no resume data or URL is found for the language.
    if (!resumeData || !resumeData.resumeUrl) {
      return next(
        new AppError(`Resume key not found for language "${lang}".`, 404)
      );
    }

    const objectKey = resumeData.resumeUrl;

    // 3. Generate a pre-signed URL for the R2 object.
    const presignedUrl = await getR2PresignedUrl(
      objectKey,
      process.env.EXPIRED_TIME
    );

    // 4. Send the successful response with the pre-signed URL.
    res.status(200).json({ status: "success", url: presignedUrl });
  }),
];

/**
 * @description Create a new resume record in the database.
 * @route POST /api/v1/resume
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} JSON response with the newly created resume record.
 */
exports.createResume = catchAsync(async (req, res) => {
  // Create a new resume record in the database using data from the request body.
  const newResume = await Resume.create(req.body);

  // Send a success response with a 201 status code and the new resume data.
  res.status(201).json({
    status: "success",
    data: {
      newResume,
    },
  });
});
