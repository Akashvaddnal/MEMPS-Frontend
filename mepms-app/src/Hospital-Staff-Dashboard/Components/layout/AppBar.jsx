// import React, { useState, useEffect } from "react";
// import MuiAppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import Brightness4Icon from "@mui/icons-material/Brightness4";
// import Brightness7Icon from "@mui/icons-material/Brightness7";
// import Avatar from "@mui/material/Avatar";
// import AccountMenu from "./AccountMenu";
// import { useThemeToggle } from "./ThemeProvider";
// import { STAFF_ENDPOINTS } from "../../API/hospitalStaffEndpoints";

// const AppBar = ({ onToggleDrawer }) => {
//   const { toggleTheme, mode } = useThemeToggle();

//   const [currentUser, setCurrentUser] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const accountMenuOpen = Boolean(anchorEl);

//   useEffect(() => {
//     async function loadUser() {
//       const user = await fetchCurrentUser();
//       setCurrentUser(user);
//     }
//     loadUser();
//   }, []);

//   const handleAccountMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleAccountMenuClose = () => setAnchorEl(null);
//   const handleSignOut = () => {
//     localStorage.removeItem("authToken");
//     window.location.href = "/login"; // Adjust routing as needed
//   };

//   return (
//     <MuiAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//       <Toolbar>
//         <IconButton color="inherit" edge="start" onClick={onToggleDrawer} sx={{ mr: 2 }}>
//           <MenuIcon />
//         </IconButton>
//         <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//           Hospital Staff Dashboard
//         </Typography>

//         <IconButton color="inherit" onClick={toggleTheme} title="Toggle light/dark mode">
//           {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
//         </IconButton>

//         {/* Account Avatar */}
//         <IconButton
//           color="inherit"
//           onClick={handleAccountMenuOpen}
//           size="small"
//           sx={{ ml: 2 }}
//           aria-controls={accountMenuOpen ? "account-menu" : undefined}
//           aria-haspopup="true"
//           aria-expanded={accountMenuOpen ? "true" : undefined}
//           title={currentUser?.username || "Account"}
//         >
//           <Avatar
//             alt={currentUser?.username || "U"}
//             src={currentUser?.profilePic || ""}
//             sx={{ width: 32, height: 32 }}
//           >
//             {!currentUser?.profilePic && currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : ""}
//           </Avatar>
//         </IconButton>

//         <AccountMenu
//           anchorEl={anchorEl}
//           open={accountMenuOpen}
//           onClose={handleAccountMenuClose}
//           onSignOut={handleSignOut}
//           user={currentUser}
//         />
//       </Toolbar>
//     </MuiAppBar>
//   );
// };

// export default AppBar;


import React, { useState, useEffect } from "react";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Avatar from "@mui/material/Avatar";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";
import AccountMenu from "./AccountMenu";
import { useThemeToggle } from "./ThemeProvider";
import { fetchCurrentUser } from "../../utils/auth"; // Make sure path is correct!

const AppBar = ({ onToggleDrawer }) => {
  const { toggleTheme, mode } = useThemeToggle();
  const [currentUser, setCurrentUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const accountMenuOpen = Boolean(anchorEl);

  // Use material-ui theme for breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    async function loadUser() {
      const user = await fetchCurrentUser();
      setCurrentUser(user);
    }
    loadUser();
  }, []);

  const handleAccountMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleAccountMenuClose = () => setAnchorEl(null);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login"; // Adjust as needed
  };

  return (
    <MuiAppBar position="fixed" elevation={2} color="primary" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Hamburger icon - always show on mobile, optional on desktop */}
        {/* <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleDrawer}
          sx={{
            mr: 2,
            display: { xs: "inline-flex", sm: "none" }, // show only on mobile
          }}
          aria-label="open sidebar"
        >
          <MenuIcon />
        </IconButton> */}
        {/* <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleDrawer}
          sx={{ mr: 2 }}           // <-- DO NOT include display: {}!
          aria-label="open sidebar"
        >
          <MenuIcon />
        </IconButton> */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleDrawer}
          sx={{ mr: 2 }}
          aria-label="open sidebar"
        >
          <MenuIcon />
        </IconButton>


        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Hospital Staff Dashboard
        </Typography>

        <IconButton color="inherit" onClick={toggleTheme} title="Toggle light/dark mode">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

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
            {!currentUser?.profilePic && currentUser?.username
              ? currentUser.username.charAt(0).toUpperCase()
              : ""}
          </Avatar>
        </IconButton>

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
