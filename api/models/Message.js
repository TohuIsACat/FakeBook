const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationID: {
      type: String,
      required: true,
    },
    senderID: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);
