const express = require("express");
const pictureController = require("../controller/pictureController");

const router = express.Router();

router
  .route("/")
  .get(pictureController.getAllPictures)
  .post(pictureController.postPicture);
router
  .route("/:id")
  .get(pictureController.getPicture)
  .patch(pictureController.updatePicture)
  .delete(pictureController.deletePicture);

module.exports = router;
