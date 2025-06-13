const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// ROUTES
const resumeRouter = require("./routes/resumeRoutes");
const articleRouter = require("./routes/articleRoutes");
const imageRouter = require("./routes/imageRoutes");
const videoRouter = require("./routes/videoRoutes");

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());

// set root URL
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the Ray Verse API 0.0", app: "RayVerse" });
});

app.use("/api/v1/resumes", resumeRouter);
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/videos", videoRouter);

module.exports = app;
