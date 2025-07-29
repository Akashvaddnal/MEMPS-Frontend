import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AppBar from "./AppBar";

export default function StaffDashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar onToggleDrawer={handleDrawerToggle} />
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: "background.default" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
