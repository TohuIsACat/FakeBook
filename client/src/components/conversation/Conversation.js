import React, { useEffect, useState } from "react";
import "./conversationStyles/conversation.css";
import { Avatar } from "@mui/material";
import axios from "axios";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // user
  useEffect(() => {
    const friendID = conversation.members.find((u) => u !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios.get("/users?userID=" + friendID);
        setUser(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      {user && (
        <Avatar src={PF + user.profilePicture} className="conversationAvatar" />
      )}

      <span className="conversationName">{user && user.username}</span>
    </div>
  );
}
