const { Router, request } = require("express");
const authMiddleware = require("../middlewares/authMiddlewares");
const router = Router();

const {
  registerUser,
  loginUser,
  getAuthors,
  getUser,
  changeAvater,
  editUser,
} = require("../controllers/userControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAuthors);
router.get("/:id", getUser);
router.post("/change-avatar", authMiddleware, changeAvater);
router.patch("/edit-user", authMiddleware, editUser);

module.exports = router;
