const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const authorizeAdmin = require("./middlewares/authorizeAdmin");

// ROUTES
const resumeRouter = require("./routes/resumeRoutes");
const articleRouter = require("./routes/articleRoutes");
const imageRouter = require("./routes/imageRoutes");
const videoRouter = require("./routes/videoRoutes");

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("Running in development mode");
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined")); // 或 'tiny'
  console.log("Running in production mode");
}

const allowedOrigins =
  process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "*";

// **CORS 配置 (非常重要!)**
// 允许前端开发服务器的源访问你的后端
// 在开发阶段，允许来自 Vite 开发服务器的请求
const corsOptions = {
  origin: allowedOrigins, // 替换为你的 Vite 开发服务器地址
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // 如果你需要发送 cookies 或授权头
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

// set root URL
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the Ray Verse API 0.0", app: "RayVerse" });
});

const apiPrefix = process.env.API_PREFIX;

app.use(`${apiPrefix}`, authorizeAdmin);

app.use(`${apiPrefix}/resumes`, resumeRouter);
app.use(`${apiPrefix}/articles`, articleRouter);
app.use(`${apiPrefix}/images`, imageRouter);
app.use(`${apiPrefix}/videos`, videoRouter);

app.all(/(.*)/, (req, res, next) => {
  const err = new AppError(
    `Cant's find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
