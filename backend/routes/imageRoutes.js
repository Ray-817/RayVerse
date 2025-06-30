const express = require("express");
const imageController = require("../controllers/imageController");

const router = express.Router();

router.route("/").post(imageController.createImage);

router.route("/thumbnails").get(imageController.getAllThumbnails);

router.route("/slug/:slug").get(imageController.getSingleImageBySlug);

module.exports = router;
