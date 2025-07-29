// // src/components/layout/AppBar.jsx

// import React from "react";
// import MuiAppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";
// import { useThemeToggle } from "./ThemeProvider";

// const AppBar = ({ onToggleDrawer }) => {
//   const { toggleTheme, mode } = useThemeToggle();

//   return (
//     <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//       <Toolbar>
//         <IconButton color="inherit" edge="start" onClick={onToggleDrawer} sx={{ mr: 2 }}>
//           <MenuIcon />
//         </IconButton>
//         <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//           Inventory Manager Dashboard
//         </Typography>
//         <IconButton color="inherit" onClick={toggleTheme}>
//           {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
//         </IconButton>
//       </Toolbar>
//     </MuiAppBar>
//   );
// };

// export default AppBar;


// src/components/layout/AppBar.jsx
import React, { useState, useEffect } from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Avatar from "@mui/material/Avatar";
import { useThemeToggle } from "./ThemeProvider";

import AccountMenu from "./AccountMenu";   // Import your AccountMenu component
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const AppBar = ({ onToggleDrawer }) => {
  const { toggleTheme, mode } = useThemeToggle();

  // State to hold current user info
  const [currentUser, setCurrentUser] = useState(null);

  // State for account menu anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const accountMenuOpen = Boolean(anchorEl);

  // Fetch current user info from token + backend
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userEmail = decoded.sub || decoded.email;

      axios
        .get("http://localhost:9090/Login-Auth-MS/api/auth/current", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data && res.data.roleName === "Inventory Manager") {
            setCurrentUser(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch current user", err);
          // Optionally logout or handle invalid token here
        });
    } catch (err) {
      console.error("Invalid token", err);
      // Optionally force logout or token clearance
    }
  }, []);

  // Handlers for account menu
  const handleAccountMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    // Clear token and optionally redirect to login page
    localStorage.removeItem("authToken");
    window.location.href = "/login";  // Adjust path as needed
  };

  return (
    <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onToggleDrawer} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Inventory Manager Dashboard
        </Typography>

        <IconButton color="inherit" onClick={toggleTheme} title="Toggle light/dark mode">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {/* Account Avatar Button */}
        <IconButton
          color="inherit"
          onClick={handleAccountMenuOpen}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={accountMenuOpen ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={accountMenuOpen ? "true" : undefined}
          title={currentUser?.username || "Account"}
        >
          <Avatar
            alt={currentUser?.username || "U"}
            src={currentUser?.profilePic || ""}
            sx={{ width: 32, height: 32 }}
          >
            {(!currentUser?.profilePic && currentUser?.username) && currentUser.username.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        {/* Account Dropdown Menu */}
        <AccountMenu
          anchorEl={anchorEl}
          open={accountMenuOpen}
          onClose={handleAccountMenuClose}
          onSignOut={handleSignOut}
          user={currentUser}
        />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
