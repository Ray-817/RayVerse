const Image = require("../models/imageModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllImages = () => {
  console.log(`getAllImages`);
};

exports.createImage = catchAsync(async (req, res) => {
  const newImage = await Image.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newImage,
    },
  });
});

exports.getImage = () => {
  console.log(`getImage`);
};
