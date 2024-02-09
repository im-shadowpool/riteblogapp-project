const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const {
  createPost,
  editPost,
  postDelete,
  postsByAuthor,
  postsByCategory,
  singlePost,
  getPosts,
} = require("../controllers/postControllers");

router.post("/", authMiddleware, createPost);
router.patch("/:id", authMiddleware, editPost);
router.delete("/:id", authMiddleware, postDelete);
router.get("/users/:id", postsByAuthor);
router.get("/categories/:category", postsByCategory);
router.get("/:id", singlePost);
router.get("/", getPosts);

module.exports = router;
