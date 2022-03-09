import React, { useContext } from "react";
import "./sidebarStyles/sidebar.css";
import CloseFriend from "../closeFriend/CloseFriend";
import {
  RssFeed,
  Chat,
  OndemandVideo,
  PeopleAlt,
  Bookmarks,
  HelpOutline,
  Work,
  Event,
  School,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Span</span>
          </li>
          <li
            className="sidebarListItem"
            onClick={() => navigate("/messenger")}
          >
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <OndemandVideo className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <PeopleAlt className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmarks className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <Work className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>

        <button className="sidebarButton">Show More</button>

        <hr className="sidebarHr" />

        <ul className="sidebarFriendList">
          {currentUser.followings.map((f) => (
            <CloseFriend key={f} friend={f} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
