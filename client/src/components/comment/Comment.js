import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import "./commentStyles/comment.css";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

export default function Comment({ comment }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [commenter, setCommenter] = useState({});

  // commenter
  useEffect(() => {
    const fetchCommenter = async () => {
      try {
        const res = await axios("/users?userID=" + comment.commenterID);
        setCommenter(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCommenter();
  }, [comment]);

  return (
    <div className="commentWrapper">
      <Link to={`/profile/${commenter.username}`}>
        <Avatar
          src={
            commenter.profilePicture
              ? PF + commenter.profilePicture
              : PF + "/person/noAvatar.png"
          }
        />
      </Link>
      <div className="commentTextContainer">
        <span className="commentUsername">
          {commenter && commenter.username}
        </span>
        <span className="commentText">{comment.text}</span>
      </div>
      <span className="commentDate">{format(comment.createdAt)}</span>
    </div>
  );
}
