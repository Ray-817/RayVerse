const express = require("express");

const resumeController = require("../controller/resumeController");

const router = express.Router();

router
  .route("/")
  .get(resumeController.getResume)
  .post(resumeController.postResume)
  .patch(resumeController.updateResume)
  .delete(resumeController.deleteResume);

module.exports = router;
