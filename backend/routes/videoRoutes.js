const express = require("express");
const videoController = require("../controller/videoController");
const router = express.Router();

router.route("/").post(videoController.createVideo);
router.route("/:id").get(videoController.getVideo);

module.exports = router;
