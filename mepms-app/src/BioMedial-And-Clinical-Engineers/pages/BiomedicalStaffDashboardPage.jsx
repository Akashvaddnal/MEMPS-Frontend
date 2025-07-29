import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import StaffDashboardLayout from "../components/layout/StaffDashboardLayout";
import Dashboard from "../components/dashboard/Dashboard";
import MaintenanceRequests from "../components/dashboard/MaintenanceRequests";
import EquipmentLifeCyclePage from "../components/dashboard/EquipmentLifeCycle";

import { fetchCurrentUser } from "../utils/auth";

export default function BiomedicalStaffDashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const user = await fetchCurrentUser();
      setCurrentUser(user);
      setLoadingUser(false);
    }
    loadUser();
  }, []);

  if (loadingUser) {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}><CircularProgress /></Box>;
  }

  if (!currentUser) {
    return <Box sx={{ m: 4 }}><p>Please login to access the dashboard</p></Box>;
  }

  return (
    <StaffDashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard currentUser={currentUser} />} />
        <Route path="maintenance-requests" element={<MaintenanceRequests currentUser={currentUser} />} />
        <Route path="equipment-life-cycle" element={<EquipmentLifeCyclePage currentUser={currentUser} />} />
        {/* Add routes for other pages */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </StaffDashboardLayout>
  );
}
