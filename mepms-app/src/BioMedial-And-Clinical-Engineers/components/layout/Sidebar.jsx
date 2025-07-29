import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, useTheme, useMediaQuery } from "@mui/material";
import { Dashboard, Build, Assignment, Devices, Settings } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <Dashboard />, path: "/biomedical-engineer-dashboard/biomedical/dashboard" },
    { label: "Maintenance Requests", icon: <Build />, path: "/biomedical-engineer-dashboard/biomedical/maintenance-requests" },
    { label: "Equipment Life Cycle", icon: <Assignment />, path: "/biomedical-engineer-dashboard/biomedical/equipment-life-cycle" },
    { label: "All Equipments", icon: <Devices />, path: "/biomedical-engineer-dashboard/biomedical/equipment" },
    { label: "Settings", icon: <Settings />, path: "/biomedical-engineer-dashboard/biomedical/settings" },
  ];

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" }
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map(({ label, icon, path }) => (
          <ListItemButton key={label} selected={location.pathname === path} onClick={() => { navigate(path); if(isMobile) onClose(); }}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
