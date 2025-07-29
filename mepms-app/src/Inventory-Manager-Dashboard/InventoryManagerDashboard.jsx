// src/InventoryManagerDashboard/InventoryManagerDashboard.jsx

import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import ThemeProvider from "./components/layout/ThemeProvider";
import AppBar from "./components/layout/AppBar";
import Drawer from "./components/layout/Drawer";

import DashboardPage from "./pages/DashboardPage";
import EquipmentLifeCycleTable from "./components/dashboard/EquipmentLifeCycleTable";
import EquipmentUsageTable from "./components/dashboard/EquipmentUsageTable";
import InventoryAuditTable from "./components/dashboard/InventoryAuditTable";
import MaintenanceRequestTable from "./components/dashboard/MaintenanceRequestTable";
import StockLevelsTable from "./components/dashboard/StockLevelsTable";
import DepartmentTable from "./components/dashboard/DepartmentTable";

const drawerWidth = 240;

function InventoryManagerDashboardContent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box 
        sx={{
            display: "flex",
            bgcolor: 'background.default',
            color: 'text.primary',
            minHeight: '100vh',
            width: '100vw',
            overflowX: 'hidden',
        }}
    >
      <AppBar onToggleDrawer={toggleDrawer} />
      <Drawer  open={drawerOpen} onClose={toggleDrawer} onNavigate={handleNavigate} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: "100vh",
        }}
      >
        <Routes location={location}>
          {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/equipment-lifecycle" element={<EquipmentLifeCycleTable />} />
          <Route path="/equipment-usage" element={<EquipmentUsageTable />} />
          <Route path="/inventory-audit" element={<InventoryAuditTable />} />
          <Route path="/maintenance-requests" element={<MaintenanceRequestTable />} />
          <Route path="/departments-details" element={<DepartmentTable />} />
          <Route path="/stock-levels" element={<StockLevelsTable />} />
          {/* Add NotFound or other routes if needed */}
        </Routes>
      </Box>
    </Box>
  );
}

export default function InventoryManagerDashboard() {
  return (
    <ThemeProvider>
      <InventoryManagerDashboardContent />
    </ThemeProvider>
  );
}
