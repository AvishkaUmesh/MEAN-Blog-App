const express = require("express");
const router = express.Router();

const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");
const extractFile = require("../middleware/post-image.middleware");

router.get("", postController.getPosts);
router.post("", authMiddleware, extractFile, postController.createPost);
router.put("/:id", authMiddleware, extractFile, postController.updatePost);
router.get("/:id", postController.getPost);
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;
