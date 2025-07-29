import React from "react";
import MaintenanceRequests from "../Components/dashboard/MaintenanceRequests";
import { fetchCurrentUser } from "../utils/auth";
import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

const MaintenanceRequestPage = () => {

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

    if (!currentUser) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );
}

// return <MaintenanceRequests currentUser={currentUser} />;

  return <MaintenanceRequests currentUser={currentUser} />;
};

export default MaintenanceRequestPage;
