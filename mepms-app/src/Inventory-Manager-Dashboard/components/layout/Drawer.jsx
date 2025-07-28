// src/components/layout/Drawer.jsx

import React from "react";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import BuildIcon from "@mui/icons-material/Build";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import StoreIcon from "@mui/icons-material/Store";

// const navigationItems = [
//   { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
//   { text: "Equipment Lifecycle", icon: <HistoryIcon />, path: "/equipment-lifecycle" },
//   { text: "Equipment Usage", icon: <BuildIcon />, path: "/equipment-usage" },
//   { text: "Inventory Audits", icon: <AssignmentIcon />, path: "/inventory-audit" },
//   { text: "Maintenance Requests", icon: <CategoryIcon />, path: "/maintenance-requests" },
//   { text: "Stock Levels", icon: <StoreIcon />, path: "/stock-levels" },
// ];

const navigationItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/inventory-dashboard" },
  { text: "Equipment Lifecycle", icon: <HistoryIcon />, path: "/inventory-dashboard/equipment-lifecycle" },
  { text: "Equipment Usage", icon: <BuildIcon />, path: "/inventory-dashboard/equipment-usage" },
  { text: "Inventory Audits", icon: <AssignmentIcon />, path: "/inventory-dashboard/inventory-audit" },
  { text: "Maintenance Requests", icon: <CategoryIcon />, path: "/inventory-dashboard/maintenance-requests" },
  { text: "Stock Levels", icon: <StoreIcon />, path: "/inventory-dashboard/stock-levels" },
];


const Drawer = ({ open, onClose, onNavigate }) => {
  return (
    <MuiDrawer 
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
      }}
    >
      <List sx={{mt:8}}>
        {navigationItems.map(({ text, icon, path }) => (
          <ListItemButton
            key={text}
            onClick={() => {
              onNavigate(path);
              onClose();
            }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </MuiDrawer>
  );
};

export default Drawer;
