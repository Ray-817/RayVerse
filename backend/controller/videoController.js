const Video = require("../models/videoModel");
const catchAsync = require("../utils/catchAsync");

exports.createVideo = catchAsync(async (req, res) => {
  const newVideo = await Video.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newVideo,
    },
  });
});

exports.getVideo = () => {
  console.log(`getVideo`);
};
