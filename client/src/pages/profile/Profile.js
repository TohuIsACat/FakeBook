import React, { useState, useEffect, useContext } from "react";
import "./profileStyles/profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import Feed from "../../components/feed/Feed";
import axios from "axios";
import { useParams } from "react-router";
import {
  AddAPhoto,
  Cancel,
  Check,
  CameraAlt,
  Save,
  Edit,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";

function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { currentUser, socket, setSocket, dispatch } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const username = useParams().username;
  const [editProfileImg, setEditProfileImg] = useState(null);
  const [editCoverImg, setEditCoverImg] = useState(null);
  const [editDesc, setEditDesc] = useState(null);
  const [editDescOpen, setEditDescOpen] = useState(false);
  const self = user._id === currentUser._id;

  // socket
  useEffect(() => {
    if (socket === null) {
      setSocket(io("ws://localhost:8900"));
    }
  }, [socket, setSocket]);

  // socket add user
  useEffect(() => {
    socket?.emit("addUser", currentUser._id);
  }, [socket, currentUser]);

  // user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  // edit profile img
  const editProfileImgSubmit = async () => {
    // upload file
    const data = new FormData();
    const fileName = Date.now() + editProfileImg.name;
    data.append("name", fileName);
    data.append("file", editProfileImg);
    try {
      await axios.post("/upload", data);
    } catch (e) {
      console.log(e);
    }
    // update user
    try {
      await axios.put("/users/" + currentUser._id, {
        userID: currentUser._id,
        profilePicture: fileName,
      });
      // context
      dispatch({ type: "EDITPROFILEIMG", payload: fileName });
    } catch (e) {
      console.log(e);
    }
    const res = await axios.get("/users?userID=" + currentUser._id);
    localStorage.setItem("currentUser", JSON.stringify(res.data));
    window.location.reload();
  };

  // edit cover
  const editCoverSubmit = async () => {
    const data = new FormData();
    const fileName = Date.now() + editCoverImg.name;
    data.append("name", fileName);
    data.append("file", editCoverImg);
    try {
      await axios.post("/upload", data);
    } catch (e) {
      console.log(e);
    }
    try {
      await axios.put("/users/" + currentUser._id, {
        userID: currentUser._id,
        coverPicture: fileName,
      });
    } catch (e) {
      console.log(e);
    }
    window.location.reload();
  };

  // edit desc
  const descSave = async () => {
    try {
      await axios.put("/users/" + currentUser._id, {
        userID: currentUser._id,
        desc: editDesc,
      });
    } catch (e) {
      console.log(e);
    }
    setEditDescOpen(false);
    setEditDesc(null);
    window.location.reload();
  };

  const descCancel = () => {
    setEditDescOpen(false);
    setEditDesc(null);
  };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {editCoverImg ? (
                <div className="editCoverImgContainer">
                  <img
                    src={URL.createObjectURL(editCoverImg)}
                    alt=""
                    className="editCoverImg"
                  />
                  <div className="editCoverButton">
                    <div className="coverSaveButton" onClick={editCoverSubmit}>
                      <Save className="editCoverSave" />
                      <span className="coverSaveText">Save</span>
                    </div>
                    <span>|</span>
                    <div
                      className="coverCancelButton"
                      onClick={() => setEditCoverImg(null)}
                    >
                      <Cancel className="editCoverCancel" />
                      <span className="coverCancelText">Cancel</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {self && (
                    <>
                      <input
                        type="file"
                        id="coverImg"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => setEditCoverImg(e.target.files[0])}
                        style={{ display: "none" }}
                      />
                      <label htmlFor="coverImg">
                        <div className="coverButton">
                          <CameraAlt className="coverButtonImg" />
                          <span className="coverButtonText">
                            Edit Cover Picture
                          </span>
                        </div>
                      </label>
                    </>
                  )}

                  <img
                    src={PF + user.coverPicture}
                    alt=""
                    className="profileCoverImg"
                  />
                </>
              )}

              {editProfileImg ? (
                <div className="editProfileImgContainer">
                  <img
                    src={URL.createObjectURL(editProfileImg)}
                    alt=""
                    className="editProfileImg"
                  />
                  <Check
                    className="editProfileImgCheckImg"
                    onClick={editProfileImgSubmit}
                  />
                  <Cancel
                    className="editProfileImgCancelImg"
                    onClick={() => setEditProfileImg(null)}
                  />
                </div>
              ) : (
                <div className="profileImgContainer">
                  <img
                    src={PF + user.profilePicture}
                    alt=""
                    className="profileUserImg"
                  />
                  {self && (
                    <>
                      <input
                        type="file"
                        id="profileImg"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => setEditProfileImg(e.target.files[0])}
                        style={{ display: "none" }}
                      />
                      <label htmlFor="profileImg">
                        <Avatar className="photoButton">
                          <AddAPhoto className="photoButtonImg" />
                        </Avatar>
                      </label>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <div className="profileDescContainer">
                {editDescOpen ? (
                  <>
                    <input
                      className="descInput"
                      placeholder={user.desc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    ></input>
                    <Save className="descIcon" onClick={descSave} />
                    <Cancel className="descIcon" onClick={descCancel} />
                  </>
                ) : (
                  <>
                    <span className="profileInfoDesc">
                      {user.desc ? user.desc : "Nothing here"}
                    </span>
                    {self && (
                      <Edit
                        className="descEdit"
                        onClick={() => setEditDescOpen(true)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
