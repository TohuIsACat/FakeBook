const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postID: {
      type: String,
      required: true,
    },
    commenterID: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
