const HttpError = require("../modal/errorModal");
const User = require("../modal/userModal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, confrimPassword } = req.body;

    //Check email exist
    const existEmail = await User.findOne({ email });
    if (existEmail)
      return next(new HttpError("Eamil already exist,Please login", 422));

    //Check Password
    if (password !== confrimPassword)
      return next(new HttpError(`Password doesn't match`, 422));

    //Bcrypt Password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = await User.create({ name, email, password: hash });

    res.status(200).json({ status: "success", data: { newUser } });
  } catch (error) {
    next(error);
  }
};

const logInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existEmail = await User.findOne({ email });

    if (!existEmail)
      return next(
        new HttpError("Your Email doesn't exist,Create Account", 422)
      );

    //check password
    const validPassword = bcrypt.compareSync(password, existEmail.password);

    if (!validPassword) return next(new HttpError("Invalid Password", 422));
    const { _id: id, name } = existEmail;

    //token
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    next(new HttpError(error));
  }
};

const editAvator = async (req, res, next) => {
  try {
    const { avator } = req.files;

    if (!req.files.avator)
      return next(new HttpError("Please Choose an image", 422));

    const user = User.findById(req.user.id);

    if (user.avator) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avator), (err) => {
        if (err) return next(new HttpError(err));
      });
    }

    const newFile = avator.name.split(".");
    const newFileName = newFile[0] + uuid() + "." + newFile[newFile.length - 1];

    avator.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) return next(new HttpError(err));

        const updateAvator = await User.findByIdAndUpdate(
          req.user.id,
          { avator: newFileName },
          { new: true }
        );

        if (!updateAvator)
          return next(new HttpError("Can't upload avator", 422));

        res.status(200).json({ status: "success", updateAvator });
      }
    );
  } catch (err) {
    next(new HttpError(err));
  }
};

const getAllAuthors = async (req, res, next) => {
  try {
    const allUser = await User.find().select("-password");

    if (!allUser) return next(new HttpError("Cannot get all user", 422));

    res.status(200).json({
      status: "success",
      result: allUser.length,
      data: { allUser },
    });
  } catch (err) {
    next(new HttpError(err));
  }
};

module.exports = { createUser, logInUser, editAvator, getAllAuthors };
