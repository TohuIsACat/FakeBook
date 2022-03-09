const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new conv
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderID, req.body.receiverID],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (e) {
    res.status(500).json(e);
  }
});

// get conv of a user
router.get("/:userID", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userID] },
    });
    res.status(200).json(conversation);
  } catch (e) {
    res.status(500).json(e);
  }
});

// delete conv
router.delete("/:conversationID", async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.conversationID);
    await conv.deleteOne();
    res.status(200).json("conv has been deleted.");
  } catch (e) {
    res.status(500).json(e);
  }
});

// get conv
router.get("/find/:firstUserID/:secondUserID", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserID, req.params.secondUserID] },
    });
    res.status(200).json(conversation);
  } catch (e) {
    res.status(500).json(e);
  }
});
module.exports = router;
