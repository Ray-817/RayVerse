const express = require("express");
const videoController = require("../controller/videoController");
const router = express.Router();

router
  .route("/")
  .post(videoController.createVideo)
  .get(videoController.getVideos);

module.exports = router;
