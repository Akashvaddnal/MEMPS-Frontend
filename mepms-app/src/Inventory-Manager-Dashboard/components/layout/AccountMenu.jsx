import React from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuItem,
  Box,
  Stack,
  Avatar,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AccountMenu({ anchorEl, open, onClose, onSignOut, user }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          width: 250,
          p: 1,
          mt: 1.5,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
      id="account-menu"
    >
      <Box sx={{ p: 1.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={user?.profilePic}
            alt={user?.name || user?.username}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography fontWeight="bold">
              {user?.username || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || "user@example.com"}
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Divider sx={{ my: 1 }} />
      {/* <MenuItem onClick={onClose}>
        <IconButton size="small" sx={{ mr: 1 }}>
          <SettingsIcon fontSize="small" />
        </IconButton>
        Account Settings
      </MenuItem> */}
      <MenuItem
        onClick={() => {
          onSignOut();
          onClose();
        }}
      >
        <IconButton size="small" sx={{ mr: 1 }}>
          <LogoutIcon fontSize="small" />
        </IconButton>
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
  user: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    profilePic: PropTypes.string,
  }),
};
