const { Router } = require("express");
const authController = require("../controller/authController");
const authMiddleWare = require("../middleware/authMiddleWare");

const router = Router();

router.post("/signup", authController.createUser);
router.post("/login", authController.logInUser);

router.get("/", authController.getAllAuthors);
router.post("/edit-avator", authMiddleWare, authController.editAvator);

module.exports = router;
