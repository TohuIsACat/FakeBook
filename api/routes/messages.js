const router = require("express").Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// add msg
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    // sort
    await Conversation.findByIdAndUpdate(req.body.conversationID, {
      dateSort: true,
    });
    res.status(200).json(savedMessage);
  } catch (e) {
    res.status(500).json(e);
  }
});
// get msg
router.get("/:conversationID", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationID: req.params.conversationID,
    });
    res.status(200).json(messages);
  } catch (e) {
    res.status(500).json(e);
  }
});

// get user's all msg
router.get("/all/:userID", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userID] },
    });
    const message = await Promise.all(
      conversation.map((c) => {
        return Message.find({
          conversationID: c._id,
        });
      })
    );
    res.status(200).json(message);
  } catch (e) {
    res.status(500).json(e);
  }
});

// delete all msg
router.delete("/all", async (req, res) => {
  try {
    await Message.deleteMany();
    res.status(200).json("All messages delete");
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
