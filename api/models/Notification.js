const mongoose = require("mongoose");

const NotificationScheam = new mongoose.Schema(
  {
    senderID: {
      type: String,
      required: true,
    },
    receiverID: {
      type: String,
      required: true,
    },
    notificationType: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    postNotificationType: {
      type: Number,
      enum: [1, 2],
    },
    chatNotificationCount: {
      type: Number,
      default: 1,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notifiation", NotificationScheam);
