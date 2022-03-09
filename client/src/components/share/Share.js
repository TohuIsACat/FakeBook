import React, { useContext, useRef, useState } from "react";
import "./shareStyles/share.css";
import {
  PermMedia,
  Label,
  AddLocationAlt,
  EmojiEmotions,
  Cancel,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Avatar } from "@mui/material";

function Share() {
  const { currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  // add new post
  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userID: currentUser._id,
      desc: desc.current.value,
    };
    // if file, upload it
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try {
        await axios.post("/upload", data);
      } catch (e) {
        console.log(e);
      }
    }
    // post
    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <Avatar
            src={PF + currentUser.profilePicture}
            className="shareProfileImg"
          />
          <input
            placeholder={`What's in your mind ${currentUser.username} ?`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <AddLocationAlt htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton">Share</button>
        </form>
      </div>
    </div>
  );
}

export default Share;
