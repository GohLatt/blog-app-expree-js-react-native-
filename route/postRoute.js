const { Router } = require("express");
const postController = require("../controller/postController");
const authMiddleWare = require("../middleware/authMiddleWare");

const router = Router();

router
  .route("/")
  .post(authMiddleWare, postController.createPost)
  .get(postController.getAllPosts);

router
  .route("/:id")
  .get(postController.getPost)
  .patch(postController.editPost)
  .delete(authMiddleWare, postController.deletePost);

router.get("/mypost/:id", postController.getMypost);

module.exports = router;
