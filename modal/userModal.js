const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must be have name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "User must be have Email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "User must be have password"],
      minlength: [6, "Password should be at least 6  "],
    },
    avator: {
      type: String,
    },
    post: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
