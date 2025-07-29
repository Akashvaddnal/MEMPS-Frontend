// src/Components/layout/Sidebar.jsx
import React from "react";
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, useTheme, useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildIcon from "@mui/icons-material/Build";
import DevicesIcon from "@mui/icons-material/Devices";
import SettingsIcon from "@mui/icons-material/Settings";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;
const miniWidth = 60; // width when mini/collapsed

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menus = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/hospital-staff-dashboard" },
    { label: "Maintenance Requests", icon: <BuildIcon />, path: "/hospital-staff-dashboard/maintenance-requests" },
    { label: "Equipment Usage Requests", icon: <RequestPageIcon />, path: "/hospital-staff-dashboard/usage-requests" },
    { label: "All Equipments", icon: <DevicesIcon />, path: "/hospital-staff-dashboard/equipment" },
    { label: "Settings", icon: <SettingsIcon />, path: "/hospital-staff-dashboard/settings" },
  ];

  if (isMobile) {
    // mobile: overlay drawer (temporary)
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menus.map(({ label, icon, path }) => (
            <ListItemButton
              key={label}
              selected={location.pathname === path}
              onClick={() => { navigate(path); onClose(); }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    );
  }

  // desktop: permanent drawer (mini variant)
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : miniWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : miniWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menus.map(({ label, icon, path }) => (
          <ListItemButton
            key={label}
            selected={location.pathname === path}
            onClick={() => navigate(path)}
            sx={{
              justifyContent: open ? 'flex-start' : 'center',
              px: open ? 2 : 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center" }}>
              {icon}
            </ListItemIcon>
            {open && <ListItemText primary={label} />}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
