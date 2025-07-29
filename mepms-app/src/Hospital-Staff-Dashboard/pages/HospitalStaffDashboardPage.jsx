import React, { useState, useEffect } from "react";
import { Box, CssBaseline, CircularProgress } from "@mui/material";
import {fetchCurrentUser} from "../utils/auth";

import Sidebar from "../Components/layout/Sidebar";
import AppBar from "../Components/layout/AppBar";

import Dashboard from "../Components/dashboard/Dashboard";

const HospitalStaffDashboardPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await fetchCurrentUser();
        console.log("DEBUG: Loaded current user:", user); // Debug log
        setCurrentUser(user);
      } catch (error) {
        console.error("ERROR loading current user:", error);
      }
    }
    loadUser();
  }, []);

  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  //   console.log("DEBUG: Sidebar toggle clicked, new mobileOpen:", !mobileOpen); // Debug log
  // };

  console.log("DEBUG: currentUser state in render:", currentUser); // Debug log before rendering

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        minHeight: "100vh",
        bgcolor: "background.default", // <-- critical line!
        color: "text.primary", // <-- ensure text is visible
      }}
    >
      {/* <CssBaseline />
      <AppBar onToggleDrawer={handleDrawerToggle} />
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} /> */}

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {currentUser ? (
          <Dashboard
            userDepartment={currentUser.departmentName || currentUser.department || null}
            currentUser={currentUser}
          />
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HospitalStaffDashboardPage;
