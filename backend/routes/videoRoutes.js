const express = require("express");
const videoController = require("../controller/videoController");
const router = express.Router();

router.route("/").post(videoController.postVideo);
router
  .route("/:id")
  .get(videoController.getVideo)
  .patch(videoController.updateVideo)
  .delete(videoController.deleteVideo);

module.exports = router;
