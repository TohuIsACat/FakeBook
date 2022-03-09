import React, { useEffect, useState } from "react";
import "./chatOnlineStyles/chatOnline.css";
import { Avatar } from "@mui/material";
import axios from "axios";

export default function ChatOnline({
  onlineUsers,
  currentID,
  conversations,
  setCurrentChat,
  setConversations,
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  // currentUser's all friends
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentID);
      setFriends(res.data);
    };
    getFriends();
  }, [currentID]);

  // onlineFriend
  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  // open chat
  const handleClick = async (user) => {
    try {
      let res = await axios.get(`/conversations/find/${currentID}/${user._id}`);
      // create a conversation
      if (res.data === null) {
        res = await axios.post("/conversations", {
          senderID: currentID,
          receiverID: user._id,
        });
        setConversations([...conversations, res.data]);
      }
      setCurrentChat(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div
          className="chatOnlineFriend"
          key={o._id}
          onClick={() => handleClick(o)}
        >
          <div className="chatOnlineAvatarContainer">
            <Avatar src={PF + o?.profilePicture} className="chatOnlineAvatar" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
