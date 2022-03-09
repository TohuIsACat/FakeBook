const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (e) {
    res.status(500).json(e);
  }
});

// update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userID === req.body.userID) {
      await post.updateOne({
        $set: req.body,
      });
      res.status(200).json("Post has been update.");
    } else {
      res.status(403).json("You can only update your post.");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.deleteOne();
    res.status(200).json("Post has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

// like/dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check already liked or not
    if (post.likes.includes(req.body.userID)) {
      await post.updateOne({
        $pull: {
          likes: req.body.userID,
        },
      });
      res.status(200).json("Post has been disliked.");
    } else {
      await post.updateOne({
        $push: {
          likes: req.body.userID,
        },
      });
      res.status(200).json("Post has been liked.");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json(e);
  }
});

// get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userID: user._id });
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json(e);
  }
});

// get timeline (user and followings) posts
router.get("/timeline/:userID", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userID);
    const userPosts = await Post.find({
      userID: currentUser._id,
    });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendID) => {
        return Post.find({
          userID: friendID,
        });
      })
    );
    res.status(200).json(userPosts.concat(friendPosts));
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
