/**
 * @fileoverview Main Express Application Entry Point.
 * @description This file sets up the Express application, configures middleware, defines API routes,
 * and handles global error management.
 * @author Ray Jiang
 * @version 1.0.1
 */
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const authorizeAdmin = require("./middlewares/authorizeAdmin");

// ROUTE IMPORTS
const resumeRouter = require("./routes/resumeRoutes");
const articleRouter = require("./routes/articleRoutes");
const imageRouter = require("./routes/imageRoutes");
const videoRouter = require("./routes/videoRoutes");

// Initialize the Express app.
const app = express();

//Trust the first-level agent
app.set("trust proxy", 1);

// --- GLOBAL MIDDLEWARE ---
// 1. CORS Configuration: Allows requests from specific origins.
const allowedOrigins =
  process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "*";

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies and authorization headers to be sent.
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// 2. Logging: Conditionally use different logging formats based on the environment.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("Running in development mode");
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  console.log("Running in production mode");
}

// 3. Body Parser: Parses incoming JSON requests.
app.use(express.json());

// --- ROUTES ---
// Root URL for a health check or a simple welcome message.
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the Ray Verse API 0.0", app: "RayVerse" });
});

// Define the API prefix from environment variables.
const apiPrefix = process.env.API_PREFIX;

// All routes after this middleware require admin authorization for non-GET requests.
app.use(`${apiPrefix}`, authorizeAdmin);

// Mount the routers for different API endpoints.
app.use(`${apiPrefix}/resumes`, resumeRouter);
app.use(`${apiPrefix}/articles`, articleRouter);
app.use(`${apiPrefix}/images`, imageRouter);
app.use(`${apiPrefix}/videos`, videoRouter);

// --- ERROR HANDLING ---
// Handle all unhandled routes (404 Not Found).
app.all(/(.*)/, (req, res, next) => {
  const err = new AppError(
    `Cant's find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

// Global error handling middleware.
app.use(globalErrorHandler);

// Export the app instance for use by the server file.
module.exports = app;
