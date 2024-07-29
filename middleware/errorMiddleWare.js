const notFound = (req, res, next) => {
  const error = new Error(`This api not found ${req.originalUrl}`);

  error.status = 404;
  next(error);
};

const globalError = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res.status(err.code || 500).json({
    status: `${err.code}`.startsWith(4) ? "fail" : "error",
    message: err.message || "Internal Server Error",
  });
};

module.exports = { notFound, globalError };
