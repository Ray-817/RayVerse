const express = require("express");
const imageController = require("../controller/imageController");

const router = express.Router();

router
  .route("/")
  .get(imageController.getAllImages)
  .post(imageController.createImage);
router
  .route("/:id")
  .get(imageController.getImage)
  .patch(imageController.updateImage)
  .delete(imageController.deleteImage);

module.exports = router;
