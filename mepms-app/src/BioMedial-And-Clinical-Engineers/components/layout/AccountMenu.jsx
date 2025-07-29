import React from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, Box, Stack, Avatar, Typography, Divider, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AccountMenu({ anchorEl, open, onClose, onSignOut, user }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{ sx: { width: 260, p: 1, mt: 1.5, boxShadow: "0 0 10px rgba(0,0,0,0.1)" } }}
      id="account-menu"
    >
      <Box sx={{ p: 1.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={user?.profilePic} sx={{ width: 48, height: 48 }}>
            {!user?.profilePic && user?.username && user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{user?.username || "User"}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email || "user@example.com"}</Typography>
          </Box>
        </Stack>
      </Box>
      <Divider />
      <MenuItem onClick={onClose}>
        <IconButton size="small" sx={{ mr: 1 }}><SettingsIcon fontSize="small" /></IconButton>
        Account Settings
      </MenuItem>
      <MenuItem onClick={() => { onSignOut(); onClose(); }}>
        <IconButton size="small" sx={{ mr: 1 }}><LogoutIcon fontSize="small" /></IconButton>
        Sign Out
      </MenuItem>
    </Menu>
  );
}

AccountMenu.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  user: PropTypes.object,
};
