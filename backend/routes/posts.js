const express = require("express");
const router = express.Router();

const Post = require("../models/post");

router.get("", (req, res, next) => {
  Post.find()
    .then((documents) => {
      return res.status(200).json({
        message: "Posts fetched successfully",
        posts: documents,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save().then((createdPost) => {
    return res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
    });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    return res.status(200).json({
      message: "Post updated",
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({
        message: "Post not found",
      });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    return res.status(200).json({
      message: "Post deleted",
    });
  });
});

module.exports = router;
