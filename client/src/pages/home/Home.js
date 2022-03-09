import React, { useState, useEffect, useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import Feed from "../../components/feed/Feed";
import "./homeStyles/home.css";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";

function Home() {
  const { currentUser, socket, setSocket } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // socket
  useEffect(() => {
    if (socket === null) {
      setSocket(io("ws://localhost:8900"));
    }
  }, [socket, setSocket]);

  // add and get users
  useEffect(() => {
    socket?.emit("addUser", currentUser._id);
    socket?.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.followings.filter((f) => users.some((u) => u.userID === f))
      );
    });
  }, [currentUser._id, currentUser.followings, socket]);

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        {/* export onlineUsers to rightbar*/}
        <Rightbar onlineUsers={onlineUsers} />
      </div>
    </>
  );
}

export default Home;
