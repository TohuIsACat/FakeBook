const router = require("express").Router();
const Notification = require("../models/Notification");

// add notification
router.post("/", async (req, res) => {
  const newNotification = new Notification(req.body);
  // make chatNotificationCount increment
  if (req.body.notificationType === 2) {
    const unreadChatNotification = await Notification.findOne({
      senderID: req.body.senderID,
      receiverID: req.body.receiverID,
      read: false,
    });
    if (unreadChatNotification) {
      try {
        await Notification.findByIdAndUpdate(unreadChatNotification._id, {
          chatNotificationCount:
            unreadChatNotification.chatNotificationCount + 1,
        });
        return res.status(200).json("chat notification update");
      } catch (e) {
        res.status(500).json(e);
      }
    }
  }
  // normal notificaiton
  try {
    const savedNotification = await newNotification.save();
    res.status(200).json(savedNotification);
  } catch (e) {
    res.status(500).json(e);
  }
});

// find users notifications
router.get("/:userID", async (req, res) => {
  try {
    const userNotifications = await Notification.find({
      receiverID: req.params.userID,
    });
    res.status(200).json(userNotifications);
  } catch (e) {
    res.status(500).json(e);
  }
});

// read notification
router.put("/:type", async (req, res) => {
  try {
    await Notification.updateMany(
      {
        receiverID: req.body.currentUserID,
        notificationType: req.params.type,
      },
      { $set: { read: true } }
    );
    res.status(200).json("notifications has been read");
  } catch (e) {
    res.status(500).json(e);
  }
});

// delete notifications
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json("notification has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
