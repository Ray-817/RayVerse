const Resume = require("../models/resumeModel");
const catchAsync = require("../util/catchAsync");

exports.getResume = async (req, res, next) => {
  console.log(`getResume`);
  res.status(200).json({
    status: "success",
  });
};
exports.createResume = catchAsync(async (req, res) => {
  const newResume = await Resume.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newResume,
    },
  });
});
