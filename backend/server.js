const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const authorizeAdmin = require("./middlewares/authorizeAdmin");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// --- 添加这两行日志 ---
console.log("Attempting to connect to MongoDB with URI (masked password):");
console.log(DB.replace(process.env.DATABASE_PASSWORD, "********")); // 打印连接字符串，但隐藏密码
// ---

mongoose
  .connect(DB)
  .then(() => {
    console.log("Cloud DB connected!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message); // 打印更简洁的错误信息
    console.error("Full Mongoose error object:", err); // 打印完整的错误对象，以便在 Vercel logs 中查看详细信息
    // 如果连接失败，应用程序将无法正常工作，可以考虑在这里退出
    // process.exit(1);
  });

// const port = process.env.PORT;
// // listen to the server
// app.listen(port, () => {
//   console.log(`App running on port ${port}`);
// });

// ROUTES
const resumeRouter = require("./routes/resumeRoutes");
const articleRouter = require("./routes/articleRoutes");
const imageRouter = require("./routes/imageRoutes");
const videoRouter = require("./routes/videoRoutes");

const allowedOrigins =
  process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "*";

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("Running in development mode");
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("tiny")); // 或 'tiny'
  console.log("Running in production mode");
}

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

app.set("trust proxy", true);

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
