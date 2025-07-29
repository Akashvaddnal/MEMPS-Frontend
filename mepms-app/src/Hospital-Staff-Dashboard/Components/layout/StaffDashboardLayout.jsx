// import React, { useState } from "react";
// import { Box, CssBaseline, Toolbar } from "@mui/material";
// import AppBar from "./AppBar";
// import Sidebar from "./Sidebar";
// import { Outlet } from "react-router-dom";

// const StaffDashboardLayout = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

//   return (
//     <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
//       <CssBaseline />
//       <AppBar onToggleDrawer={handleDrawerToggle} />
//       <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
//       {/* Drawer variant for Desktop/Mobile can be handled inside Sidebar */}
//       <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh", bgcolor: "background.default" }}>
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default StaffDashboardLayout;


// src/Components/layout/StaffDashboardLayout.jsx
import React, { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import AppBar from "./AppBar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const StaffDashboardLayout = () => {
  // const [mobileOpen, setMobileOpen] = useState(false);
  // const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const [drawerOpen, setDrawerOpen] = useState(true); // open = expanded; false = mini/collapsed

// On hamburger click, toggle open/collapsed on desktop, open/close on mobile
const handleDrawerToggle = () => setDrawerOpen((open) => !open);


  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />
      <AppBar onToggleDrawer={handleDrawerToggle} />
      <Sidebar open={drawerOpen} onClose={handleDrawerToggle} />
      {/* <-- Drawer should be always rendered */}
      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          mt: 8, // leaves space for AppBar
        }}
      >
        <Outlet />
      </Box> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          mt: 4, // leaves space for AppBar
          // marginLeft: open ? `${drawerWidth}px` : `${miniWidth}px`, // optional, or use CSS grid
          transition: theme => theme.transitions.create('margin', { duration: theme.transitions.duration.shortest })
        }}
      >
        <Outlet />
      </Box>

    </Box>
  );
};

export default StaffDashboardLayout;
