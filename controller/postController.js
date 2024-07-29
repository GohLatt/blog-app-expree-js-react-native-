const { default: mongoose } = require("mongoose");
const HttpError = require("../modal/errorModal");
const Post = require("../modal/postModal");
const User = require("../modal/userModal");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const getAllPosts = async (req, res, next) => {
  try {
    const allPosts = await Post.find().sort("updatedAt");

    if (!allPosts) return next(new HttpError("Posts not found", 404));

    res.status(200).json({
      status: "succees",
      result: allPosts.length,
      data: {
        allPosts,
      },
    });
  } catch (err) {
    next(new HttpError(err));
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (!title && !description && !category && !req.files)
      return next(new HttpError("Fill all the fields", 422));

    const { thumail } = req.files;
    const nameSplit = thumail.name.split(".");
    const fileName =
      nameSplit[0] + uuid() + "." + nameSplit[nameSplit.length - 1];

    thumail.mv(path.join(__dirname, "..", "uploads", fileName), async (err) => {
      if (err) return next(new HttpError(err));

      const newPost = await Post.create({
        title,
        description,
        category,
        thumail: fileName,
        creater: req.user.id,
      });

      if (!newPost) return next(new HttpError("Can't creat post", 422));

      const currentUser = await User.findById(req.user.id);

      await User.findByIdAndUpdate(req.user.id, { post: currentUser.post + 1 });

      res.status(201).json({
        status: "success",
        data: {
          newPost,
        },
      });
    });
  } catch (err) {
    next(new HttpError(err));
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return next(new HttpError("post not found", 404));
    res.status(200).json({
      status: "success",
      data: { post },
    });
  } catch (err) {
    next(new HttpError(err));
  }
};

const editPost = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (!title && !description && !category)
      return next(new HttpError("fill all the fields", 422));

    if (!req.files.thumail) {
      const postUpdate = await Post.findByIdAndUpdate(
        req.params.id,
        { title, description, category },
        { new: true }
      );
      res.status(200).json({
        status: "success",
        data: {
          postUpdate,
        },
      });
    } else {
      const post = await Post.findById(req.params.id);

      fs.unlink(path.join(__dirname, "..", "uploads", post.thumail), (err) => {
        if (err) return next(new HttpError(err));
      });

      const { thumail } = req.files;
      const nameSplit = thumail.name.split(".");
      const fileName =
        nameSplit[0] + uuid() + "." + nameSplit[nameSplit.length - 1];

      thumail.mv(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) return next(new HttpError(err));

          const postUpdate = await Post.findByIdAndUpdate(
            req.params.id,
            { title, description, category, thumail: fileName },
            { new: true }
          );

          res.status(200).json({
            status: "success",
            data: {
              postUpdate,
            },
          });
        }
      );
    }
  } catch (err) {
    next(new HttpError(err));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return next(new HttpError("Post not found", 404));

    if (post.thumail) {
      fs.unlink(
        path.join(__dirname, "..", "uploads", post.thumail),
        async (err) => {
          if (err) return next(new HttpError(err));

          await Post.findByIdAndDelete(req.params.id);
          const user = await User.findById(req.user.id);
          await User.findByIdAndUpdate(
            req.params.id,
            { post: user.post - 1 },
            { new: true }
          );

          res.status(200).json({
            status: "success",
          });
        }
      );
    }
  } catch (err) {
    next(new HttpError(err));
  }
};

const getMypost = async (req, res, next) => {
  try {
    const userId = req.params.id; // Ensure userId is a valid ObjectId
    const posts = await Post.find({ creater: userId });

    if (posts.length === 0) {
      return next(new HttpError("Post not found", 422));
    }

    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (err) {
    next(new HttpError(err.message, 500));
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
  getMypost,
};
