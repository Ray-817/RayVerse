const express = require("express");

const resumeController = require("../controller/resumeController");

const router = express.Router();

router
  .route("/")
  .get(resumeController.getResume)
  .post(resumeController.createResume);

module.exports = router;
