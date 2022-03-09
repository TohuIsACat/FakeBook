import React, { useEffect, useState } from "react";
import "./onlineStyles/online.css";
import axios from "axios";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router";

function Online({ onlineUserID }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [onlineUser, setOnlineUser] = useState();
  const navigate = useNavigate();

  // onlineUsers
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/users?userID=" + onlineUserID);
        setOnlineUser(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, [onlineUserID]);
  return (
    <div>
      <li
        className="rightbarFriend"
        onClick={() => {
          navigate("/messenger");
        }}
      >
        <div className="rightbarProfileImgContainer">
          <Avatar src={PF + onlineUser?.profilePicture} />
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">{onlineUser?.username}</span>
      </li>
    </div>
  );
}

export default Online;
