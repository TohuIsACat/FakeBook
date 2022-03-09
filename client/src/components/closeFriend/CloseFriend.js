import React, { useState, useEffect } from "react";
import "./closeFriendStyles/closeFriend.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

function CloseFriend({ friend }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});

  // user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userID=${friend}`);
      setUser(res.data);
    };

    fetchUser();
  }, [friend]);

  return (
    <div>
      <li className="sidebarFriend">
        <Link to={`/profile/${user.username}`}>
          <Avatar
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "/person/noAvatar.png"
            }
            sx={{ width: "32px", height: "32px" }}
          />
        </Link>
        <span className="sidebarFriendName"> {user.username} </span>{" "}
      </li>{" "}
    </div>
  );
}

export default CloseFriend;
