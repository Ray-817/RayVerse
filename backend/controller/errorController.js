const mongoose = require("mongoose");
const AppError = require("../utils/appError");

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    // error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrPro = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(`ERROR⛔: `, err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong O.O",
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handlePuplicateFieldsDB = (err) => {
  const message = `Duplicate fidld value:${err.errorResponse.keyValue.name},Please use another value.`;
  return new AppError(message, 400);
};

const handleWrongValueDB = (error) => {
  const message = `Invalid input data: ${error.message
    .match(/(?<=:).*/)[0]
    .match(/(?<=:).*/)[0]
    .trim()}`;
  // console.log(error);
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid Token! You're not authorized!", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.kind === "ObjectId") {
      error = handleCastErrorDB(error);
    }

    if (err.code === 11000) {
      error = handlePuplicateFieldsDB(error);
    }

    if (err instanceof mongoose.Error.ValidationError) {
      error = handleWrongValueDB(err);
    }

    if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    }

    sendErrPro(error, res);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: `${err.message} ⛔from global handler`,
  });
};
