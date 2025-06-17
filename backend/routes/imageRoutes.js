const express = require("express");
const imageController = require("../controller/imageController");

const router = express.Router();

router
  .route("/")
  .get(imageController.getAllImages)
  .post(imageController.createImage);
router.route("/:id").get(imageController.getImage);

module.exports = router;
