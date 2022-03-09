import React, { useState, useEffect } from "react";
import "./notificationListStyles/notificationList.css";
import { Avatar } from "@mui/material";
import axios from "axios";
import { format } from "timeago.js";

export default function NotificationList({
  notification,
  type,
  empty,
  setNotifications,
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [sender, setSender] = useState(null);

  // sender
  useEffect(() => {
    const getSender = async () => {
      try {
        const res = await axios.get("/users?userID=" + notification.senderID);
        setSender(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getSender();
  }, [notification]);

  // delete
  const deleteHandler = async () => {
    try {
      await axios.delete("/notifications/" + notification._id);
      setNotifications((prev) => [
        ...prev.filter((n) => n._id !== notification._id),
      ]);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {empty ? (
        <div className="notificationList">
          <div className="notification">
            <span className="notificationEmpty">Empty</span>
          </div>
        </div>
      ) : (
        notification.notificationType === type && (
          <div className="notificationList">
            <Avatar
              className="notificationImg"
              src={PF + sender?.profilePicture}
            />
            {sender && (
              <div className="notification">
                <div className="notificationMain">
                  <span className="notificationText">
                    {type === 1
                      ? `${sender.username} is following you!`
                      : type === 2
                      ? `${sender.username} send you ${notification.chatNotificationCount} message`
                      : sender.username +
                        (notification.postNotificationType === 1
                          ? " like your post!"
                          : " leave you a comment!")}
                  </span>{" "}
                  <span className="notificationDelete" onClick={deleteHandler}>
                    x
                  </span>
                </div>

                <span className="notificationDate">
                  {format(notification.createdAt)}
                </span>
              </div>
            )}
          </div>
        )
      )}
    </>
  );
}
