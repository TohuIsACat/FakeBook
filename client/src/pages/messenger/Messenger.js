import React, { useContext, useEffect, useRef, useState } from "react";
import "./messengerStyles/messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Close, AttachFile } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { Avatar } from "@mui/material";
import { io } from "socket.io-client";

export default function Messenger() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const { currentUser, socket, setSocket } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [textImg, setTextImg] = useState(null);
  const scrollRef = useRef();

  // socket
  useEffect(() => {
    if (socket === null) {
      setSocket(io("ws://localhost:8900"));
    }
  }, [socket, setSocket]);

  // socket_getMessage
  useEffect(() => {
    socket?.on("getMessage", (data) => {
      setArrivalMessage({
        senderID: data.senderID,
        text: data.text,
        image: data.image,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  // socket add and get users
  useEffect(() => {
    socket?.emit("addUser", currentUser._id);
    socket?.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.followings.filter((f) => users.some((u) => u.userID === f))
      );
    });
  }, [socket, currentUser]);

  // online message
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.senderID) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // get all users
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get("/users/all");
        setAllUsers(res.data);
      } catch (e) {
        console.log(e);
      }
      const res = await axios.get("/users/all");
      setAllUsers(res.data);
    };
    getAllUsers();
  }, []);

  // search currentUser's followings
  useEffect(() => {
    const followings = allUsers.filter((u) =>
      u.followers.includes(currentUser._id)
    );
    setSearchResult(
      followings.filter((f) =>
        f.username.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, currentUser._id, allUsers]);

  // get currentUser's conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + currentUser._id);
        setConversations(
          res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );
      } catch (e) {
        console.log(e);
      }
    };
    getConversations();
  }, [currentUser._id]);

  // get currentChat messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  // get chatUser
  useEffect(() => {
    if (currentChat) {
      const chatUserID = currentChat.members.filter(
        (u) => u !== currentUser._id
      );
      const getChatUser = async () => {
        try {
          const res = await axios.get("/users?userID=" + chatUserID);
          setChatUser(res.data);
        } catch (e) {
          console.log(e);
        }
      };
      getChatUser();
    }
  }, [currentChat, currentUser]);

  // send message
  const submitHandler = async () => {
    // if file
    const data = new FormData();
    const fileName = Date.now() + textImg?.name;
    data.append("name", fileName);
    data.append("file", textImg);
    try {
      await axios.post("/upload", data);
    } catch (e) {
      console.log(e);
    }

    const message = {
      senderID: currentUser._id,
      text: newMessage,
      conversationID: currentChat._id,
      image: fileName || null,
    };

    // socket_sendMessage
    socket.emit("sendMessage", {
      senderID: currentUser._id,
      receiverID: chatUser._id,
      text: newMessage,
      image: fileName,
    });

    try {
      // messasge
      const res = await axios.post("/messages", message);
      // notification
      await axios.post("/notifications", {
        senderID: currentUser._id,
        receiverID: chatUser._id,
        notificationType: 2,
      });
      // sort conversation
      const sort = await axios.get("/conversations/" + currentUser._id);
      setConversations(
        sort.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
      setMessages(messages.concat(res.data));
      setNewMessage("");
      setTextImg(null);
    } catch (e) {
      console.log(e);
    }
  };

  // close chat, if there is no message, delete it
  const closeHandler = async () => {
    if (messages.length === 0) {
      await axios.delete("/conversations/" + currentChat._id);
      setConversations(conversations.filter((c) => c._id !== currentChat._id));
    }
    setCurrentChat(null);
  };

  // search
  const handleClick = async (user) => {
    try {
      let res = await axios.get(
        `/conversations/find/${currentUser._id}/${user._id}`
      );
      // create a conversation
      if (res.data === null) {
        res = await axios.post("/conversations", {
          senderID: currentUser._id,
          receiverID: user._id,
        });
        setConversations([...conversations, res.data]);
      }
      setCurrentChat(res.data);
      setSearchInput("");
    } catch (e) {
      console.log(e);
    }
  };

  // scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger" onClick={() => setSearchInput("")}>
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              className="chatMenuInput"
              placeholder="Search for friends"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <div className="messengerSearchListContainer">
              {searchInput !== "" &&
                searchResult.map((r) => (
                  <div
                    className="messengerSearchList"
                    key={r._id}
                    onClick={() => handleClick(r)}
                  >
                    <Avatar src={PF + r.profilePicture} className="resultImg" />
                    <span className="resultText">{r.username}</span>
                  </div>
                ))}
            </div>

            {conversations.map((c) => (
              <div
                key={c._id}
                onClick={() => {
                  setCurrentChat(c);
                }}
              >
                <Conversation conversation={c} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </div>

        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatTitle">
                  <Avatar
                    className="chatTitleAvatar"
                    src={chatUser && PF + chatUser.profilePicture}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/profile/" + chatUser.username)}
                  />
                  <span className="chatTitleUsername">
                    {chatUser && chatUser.username}
                  </span>
                  <Close className="chatCloseBtn" onClick={closeHandler} />
                </div>

                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef} key={m._id}>
                      <Message message={m} />
                    </div>
                  ))}{" "}
                  {textImg && (
                    <div className="viewImgContainer">
                      <img
                        src={URL.createObjectURL(textImg)}
                        alt=""
                        className="viewImg"
                      />
                      <Close
                        className="imgClose"
                        onClick={() => setTextImg(null)}
                      />
                    </div>
                  )}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="Write something..."
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submitHandler();
                      }
                    }}
                    value={newMessage}
                  ></textarea>
                  <input
                    type="file"
                    accept=".png,.jpeg,.jpg"
                    id="textImg"
                    onChange={(e) => setTextImg(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="textImg">
                    <AttachFile className="fileIcon" />
                  </label>

                  <button className="chatSubmitButton" onClick={submitHandler}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentID={currentUser._id}
              conversations={conversations}
              setCurrentChat={setCurrentChat}
              setConversations={setConversations}
            />
          </div>
        </div>
      </div>
    </>
  );
}
