// import React from "react";
// import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, useTheme, useMediaQuery } from "@mui/material";
// import { Dashboard, Build, Assignment, Devices, Settings } from "@mui/icons-material";
// import { useNavigate, useLocation } from "react-router-dom";

// const drawerWidth = 240;

// export default function Sidebar({ open, onClose }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     { label: "Dashboard", icon: <Dashboard />, path: "/biomedical-engineer-dashboard/dashboard" },
//     { label: "Maintenance Requests", icon: <Build />, path: "/biomedical-engineer-dashboard/maintenance-requests" },
//     { label: "Equipment Life Cycle", icon: <Assignment />, path: "/biomedical-engineer-dashboard/equipment-life-cycle" },
//     { label: "All Equipments", icon: <Devices />, path: "/biomedical-engineer-dashboard/equipment" },
//     { label: "Settings", icon: <Settings />, path: "/biomedical-engineer-dashboard/settings" },
//   ];

//   return (
//     <Drawer
//       variant={isMobile ? "temporary" : "permanent"}
//       open={isMobile ? open : true}
//       onClose={onClose}
//       ModalProps={{ keepMounted: true }}
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" }
//       }}
//     >
//       <Toolbar />
//       <Divider />
//       <List>
//         {menuItems.map(({ label, icon, path }) => (
//           <ListItemButton key={label} selected={location.pathname === path} onClick={() => { navigate(path); if(isMobile) onClose(); }}>
//             <ListItemIcon>{icon}</ListItemIcon>
//             <ListItemText primary={label} />
//           </ListItemButton>
//         ))}
//       </List>
//     </Drawer>
//   );
// }


// src/Components/layout/Sidebar.jsx
import React from "react";
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, useTheme, useMediaQuery,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { Dashboard, Build, Assignment, Devices, Settings } from "@mui/icons-material";

const drawerWidth = 240;
const miniWidth = 60; // width when mini/collapsed

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menus = [
    { label: "Dashboard", icon: <Dashboard />, path: "/biomedical-engineer-dashboard/dashboard" },
    { label: "Maintenance Requests", icon: <Build />, path: "/biomedical-engineer-dashboard/maintenance-requests" },
    { label: "Equipment Life Cycle", icon: <Assignment />, path: "/biomedical-engineer-dashboard/equipment-life-cycle" },
    { label: "All Equipments", icon: <Devices />, path: "/biomedical-engineer-dashboard/equipment" },
    { label: "Settings", icon: <Settings />, path: "/biomedical-engineer-dashboard/settings" },
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
