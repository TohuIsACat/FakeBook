import React, { useContext, useEffect, useState } from "react";
import "./topbarStyles/topbar.css";
import { Search } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import AccountMenu from "../accountMenu/AccountMenu";
import NotificationList from "../notificationList/NotificationList";
import { Avatar } from "@mui/material";
import { Chat, Person, Notifications } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function Topbar() {
  const navigate = useNavigate();
  const { currentUser, socket } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [searchInput, setSearchInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [arrivalNotifications, setArrivalNotifications] = useState([]);
  const [unReadNotifications, setUnReadNotifications] = useState([]);
  const [open, setOpen] = useState(0);

  // socket
  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setArrivalNotifications({
        senderID: data.senderID,
        notificationType: data.notificationType,
        postNotificationType: data.postNotificationType,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  // online Notification
  useEffect(() => {
    arrivalNotifications &&
      setUnReadNotifications((prev) => [...prev, arrivalNotifications]);
  }, [arrivalNotifications]);

  // all users for search
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get("/users/all");
        setAllUsers(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getAllUsers();
  }, []);

  // search result
  useEffect(() => {
    setSearchResult(
      allUsers.filter((u) =>
        u.username.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, allUsers]);

  // navigate to profile
  const searchResultClick = (r) => {
    navigate("/profile/" + r.username);
    setSearchInput("");
  };

  // notification
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get("/notifications/" + currentUser._id);
        setNotifications(
          res.data.sort((n1, n2) => {
            return new Date(n2.createdAt) - new Date(n1.createdAt);
          })
        );
      } catch (e) {
        console.log(e);
      }
    };
    getNotifications();
  }, [currentUser]);

  // unread notification
  useEffect(() => {
    setUnReadNotifications(notifications.filter((n) => n.read === false));
  }, [notifications]);

  // to choose open which notification
  // 0 means close
  const openHandler = async (type) => {
    // if already set it close
    if (open === type) {
      setOpen(0);
    } else {
      setOpen(type);
      if (
        unReadNotifications.filter((n) => n.notificationType === type)
          .length !== 0
      ) {
        try {
          await axios.put("/notifications/" + type, {
            currentUserID: currentUser._id,
          });
          const res = await axios.get("/notifications/" + currentUser._id);
          setNotifications(
            res.data.sort((n1, n2) => {
              return new Date(n2.createdAt) - new Date(n1.createdAt);
            })
          );
          setUnReadNotifications(notifications.filter((n) => n.read === false));
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  // same as openHandler, just for mouseMove event
  const iconMouseHandler = async (type) => {
    if (open !== 0) {
      setOpen(type);
      if (
        unReadNotifications.filter((n) => n.notificationType === type)
          .length !== 0
      ) {
        try {
          await axios.put("/notifications/" + type, {
            currentUserID: currentUser._id,
          });
          const res = await axios.get("/notifications/" + currentUser._id);
          setNotifications(
            res.data.sort((n1, n2) => {
              return new Date(n2.createdAt) - new Date(n1.createdAt);
            })
          );
          setUnReadNotifications(notifications.filter((n) => n.read === false));
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  return (
    <div className="topbar">
      <div className="topbarContainer">
        <div className="topbarLeft">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">FakeBook</span>
          </Link>
        </div>

        <div className="topbarCenter">
          <div className="searchbar">
            <Search className="searchIcon" />
            <input
              placeholder="Search for friend, post or video"
              className="searchInput"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <div className="searchList">
              {/* if searchInput not empty, open searchList */}
              {searchInput !== "" &&
                searchResult.map((r) => (
                  <div
                    className="searchResult"
                    onClick={() => searchResultClick(r)}
                    key={r._id}
                  >
                    <Avatar
                      className="searchResultImg"
                      src={PF + r.profilePicture}
                    />
                    <span className="searchResultText">{r.username}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="topbarRight">
          <div className="topbarLinks">
            <span className="topbarLink" onClick={() => navigate("/")}>
              Homepage
            </span>
            <span className="topbarLink" onClick={() => navigate("/messenger")}>
              Messenger
            </span>
          </div>

          <div className="topbarIcons">
            {/* open */}
            {open !== 0 && (
              <div
                className="notificationListWrapper"
                onMouseLeave={() => setOpen(0)}
              >
                {/* if there is not notification return empty*/}
                {!notifications.some((n) => n.notificationType === open) && (
                  <NotificationList empty={true} />
                )}
                {/* use the number of open to choose notification type */}
                {notifications.map((n) => (
                  <NotificationList
                    key={n._id}
                    notification={n}
                    type={open}
                    setNotifications={setNotifications}
                  />
                ))}
              </div>
            )}

            {/* open=1 type=1*/}
            <div
              className={open === 1 ? "open topbarIconItem" : "topbarIconItem"}
              onClick={() => openHandler(1)}
              onMouseEnter={() => iconMouseHandler(1)}
            >
              <Person className="topbarIcon" />
              {/* unread notification */}
              {unReadNotifications.filter((n) => n.notificationType === 1)
                .length !== 0 && (
                <span className="topbarIconBadge">
                  {
                    unReadNotifications.filter((n) => n.notificationType === 1)
                      .length
                  }
                </span>
              )}
            </div>

            <div
              className={open === 2 ? "open topbarIconItem" : "topbarIconItem"}
              onClick={() => openHandler(2)}
              onMouseEnter={() => iconMouseHandler(2)}
            >
              <Chat />
              {unReadNotifications.filter((n) => n.notificationType === 2)
                .length !== 0 && (
                <span className="topbarIconBadge">
                  {
                    unReadNotifications.filter((n) => n.notificationType === 2)
                      .length
                  }
                </span>
              )}
            </div>

            <div
              className={open === 3 ? "open topbarIconItem" : "topbarIconItem"}
              onClick={() => openHandler(3)}
              onMouseEnter={() => iconMouseHandler(3)}
            >
              <Notifications />
              {unReadNotifications.filter((n) => n.notificationType === 3)
                .length !== 0 && (
                <span className="topbarIconBadge">
                  {
                    unReadNotifications.filter((n) => n.notificationType === 3)
                      .length
                  }
                </span>
              )}
            </div>
          </div>
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}

export default Topbar;
