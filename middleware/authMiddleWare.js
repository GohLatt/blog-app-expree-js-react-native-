const jwt = require("jsonwebtoken");
const HttpError = require("../modal/errorModal");

const authMiddleWare = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) return next(new HttpError(err));

      req.user = decoded;
      next();
    });
  } else {
    return next(new HttpError("Need Token", 403));
  }
};

module.exports = authMiddleWare;
