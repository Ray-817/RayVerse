const AppError = require("../utils/appError");

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    // error: err, // 通常在开发环境显示完整的错误对象有助于调试
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
    // 编程错误或未知错误，记录到服务器日志
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
  // 注意这里 err.errorResponse.keyValue.name 可能不存在，最好做空值检查
  const duplicateKey = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
  const duplicateValue = err.keyValue
    ? Object.values(err.keyValue)[0]
    : "value";
  const message = `Duplicate field value: "${duplicateValue}" for ${duplicateKey}. Please use another value.`;
  return new AppError(message, 400);
};

const handleWrongValueDB = (error) => {
  // 这是一个非常具体的错误消息解析，如果 Mongoose 验证错误消息格式变化，可能需要调整
  const message = `Invalid input data: ${error.message
    .match(/(?<=:).*/)[0]
    .match(/(?<=:).*/)[0]
    .trim()}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid Token! You're not authorized!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
    return; // <--- 关键：发送响应后立即返回，阻止后续代码执行
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err }; // 创建一个副本以避免修改原始错误对象

    // 针对特定错误类型进行处理
    if (error.name === "CastError") {
      // Mongoose CastError
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      // MongoDB duplicate key error
      error = handlePuplicateFieldsDB(error);
    }

    if (error.name === "ValidationError") {
      // Mongoose ValidationError
      error = handleWrongValueDB(error);
    }

    if (error.name === "JsonWebTokenError") {
      // JWT 签名错误
      error = handleJWTError();
    }

    if (error.name === "TokenExpiredError") {
      // JWT 过期错误
      error = handleJWTExpiredError();
    }

    sendErrPro(error, res);
    return; // <--- 关键：发送响应后立即返回，阻止后续代码执行
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: `${err.message} ⛔from global handler`,
  });
};
