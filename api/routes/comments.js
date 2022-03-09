const router = require("express").Router();
const Comment = require("../models/Comment");

// add comm
router.post("/", async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (e) {
    res.status(500).json(e);
  }
});
// get comm
router.get("/:postID", async (req, res) => {
  try {
    const comments = await Comment.find({
      postID: req.params.postID,
    });
    res.status(200).json(comments);
  } catch (e) {
    res.status(500).json(e);
  }
});

// delete all comment by post
router.delete("/:postID", async (req, res) => {
  try {
    await Comment.deleteMany({ postID: req.params.postID });
    res.status(200).json("comments has been deleted.");
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
