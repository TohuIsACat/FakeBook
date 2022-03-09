import React, { useState } from "react";
import { Menu, MenuItem, ListItemIcon, IconButton } from "@mui/material";
import { Edit, Delete, MoreVert } from "@mui/icons-material";
import axios from "axios";

export default function PostMenu({ post }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const deletePost = async () => {
    try {
      await axios.delete("/comments/" + post._id);
      await axios.delete("/posts/" + post._id);
    } catch (e) {
      console.log(e);
    }
    window.location.reload();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: "20ch",
            width: "15ch",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={deletePost}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
