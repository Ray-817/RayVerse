const Video = require("../models/videoModel");
const catchAsync = require("../util/catchAsync");

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

exports.updateVideo = () => {
  console.log(`updateVideo`);
};

exports.deleteVideo = () => {
  console.log(`deleteVideo`);
};
