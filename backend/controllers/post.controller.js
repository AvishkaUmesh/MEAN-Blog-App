const Post = require("../models/post.model");

exports.getPosts = (req, res, next) => {
  const pageSize = req.query.pagesize;
  const currentPage = req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(+pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      return res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.createPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath:
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });

  post
    .save()
    .then((createdPost) => {
      return res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Creating a post failed!",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.matchedCount === 1 && result.modifiedCount === 1) {
        return res.status(200).json({
          message: "Post updated successfully",
        });
      } else if (result.matchedCount === 0) {
        return res.status(401).json({
          message: "Not authorized",
        });
      } else {
        return res.status(200).json({
          message: "No changes made to the post",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Couldn't update post",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        return res.status(200).json(post);
      } else {
        return res.status(404).json({
          message: "Post not found",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        return res.status(200).json({
          message: "Post deleted successfully",
        });
      } else {
        return res.status(401).json({
          message: "Not authorized",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Deleting post failed!",
      });
    });
};
