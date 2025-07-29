import React, { useState, useEffect } from "react";
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme, useMediaQuery } from "@mui/material";
import { useThemeToggle } from "./ThemeProvider";
import AccountMenu from "./AccountMenu";
import { fetchCurrentUser } from "../../utils/auth";

export default function AppBar({ onToggleDrawer }) {
  const { toggleTheme, mode } = useThemeToggle();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  const handleMenuOpen = e => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <MuiAppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        { (isMobile) && (
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={onToggleDrawer} aria-label="open drawer">
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Biomedical & Clinical Engineer Dashboard
        </Typography>
        <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <IconButton color="inherit" onClick={handleMenuOpen} aria-controls="account-menu" aria-haspopup="true" aria-expanded={Boolean(anchorEl)} sx={{ ml: 2 }}>
          <Avatar src={user?.profilePic}>
            {!user?.profilePic && user?.username && user.username.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
        <AccountMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onSignOut={handleSignOut}
          user={user}
        />
      </Toolbar>
    </MuiAppBar>
  );
}
