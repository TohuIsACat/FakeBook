import React, { useContext, useEffect, useState } from "react";
import "./messageStyles/message.css";
import { Avatar } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { format } from "timeago.js";
import axios from "axios";

export default function Message({ message }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { currentUser } = useContext(AuthContext);
  const [sender, setSender] = useState(null);

  // sender
  useEffect(() => {
    const getSender = async () => {
      try {
        const res = await axios.get("/users?userID=" + message.senderID);
        setSender(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getSender();
  }, [message.senderID]);

  return (
    <div
      className={
        message.senderID === currentUser._id ? "message own" : "message"
      }
    >
      <div className="messageTop">
        <Avatar
          src={sender && PF + sender.profilePicture}
          alt=""
          className="messageAvatar"
        />

        <p className="messageText">
          {message.image && (
            <img className="messageImg" src={PF + message.image} alt="" />
          )}
          {message.text}
        </p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
