exports.getResume = async (req, res, next) => {
  console.log(`getResume`);
  res.status(200).json({
    status: "success",
  });
};
exports.postResume = () => {
  console.log(`postResume`);
};
exports.updateResume = () => {
  console.log(`updateResume`);
};
exports.deleteResume = () => {
  console.log(`deleteResume`);
};
