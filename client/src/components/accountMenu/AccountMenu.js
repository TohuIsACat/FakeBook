import React, { useState, useContext } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
} from "@mui/material";
import { Settings, Logout, Create } from "@mui/icons-material";
import "./accountMenuStyles/accountMenu.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccountMenu() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const profileClicker = () => {
    navigate(`/profile/${currentUser.username}`);
  };
  // logout
  const logoutClicker = () => {
    localStorage.setItem("currentUser", null);
    navigate("/");
    window.location.reload();
  };
  return (
    <>
      <div className="accountMenuContainer">
        <IconButton
          onClick={handleClick}
          size="small"
          color="inherit"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            className="accountMenuAvater"
            src={PF + currentUser.profilePicture}
          />
        </IconButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={profileClicker}>
          <Avatar
            className="accountMenuImg"
            src={
              currentUser.profilePicture
                ? PF + currentUser.profilePicture
                : PF + "/person/noAvatar.png"
            }
          />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Create fontSize="small" />
          </ListItemIcon>
          Edit profile
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={logoutClicker}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
