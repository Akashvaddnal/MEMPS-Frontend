import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, Toolbar, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Divider, Avatar, Box, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
  { label: 'Orders', icon: <ShoppingCartIcon />, key: 'orders' },
  { label: 'User Management', icon: <GroupIcon />, key: 'users' },
  { label: 'Role Management', icon: <SecurityIcon />, key: 'roles' },
  { label: 'Audit Logs', icon: <HistoryIcon />, key: 'auditLogs' },
];

const DRAWER_WIDTH = 220;
const MINI_SIDEBAR_WIDTH = 62;

export default function Sidebar({ user,mini, selected, onSelect, onMiniToggle }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: mini ? MINI_SIDEBAR_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: mini ? MINI_SIDEBAR_WIDTH : DRAWER_WIDTH,
          transition: theme =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          overflowX: 'hidden',
        },
      }}
      PaperProps={{ elevation: 3 }}
    >
      <Toolbar sx={{ justifyContent: mini ? 'center' : 'space-between', px: 1 }}>
        {mini ? (
          
          <Typography sx={{ ml: 0, fontSize: '0.875rem' }} noWrap fontWeight="medium">
            {user.name}
          </Typography>
        ) : (
          <Typography sx={{ ml: 0, fontSize: '0.875rem' }} noWrap fontWeight="medium">
            Admin Dashboard
          </Typography>
        )}

        <IconButton
          onClick={onMiniToggle}
          sx={{ ml: mini ? 0 : 2, display: mini ? 'none' : 'inline-flex' }}
          size="small"
          aria-label={mini ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          onClick={onMiniToggle}
          sx={{ mx: 'auto', display: mini ? 'inline-flex' : 'none', mt: 1 }}
          size="small"
          aria-label={mini ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Divider />
<List>
  {NAV_ITEMS.map((nav) => (
    <ListItem disablePadding key={nav.key} selected={selected === nav.key}>
      <ListItemButton onClick={() => onSelect(nav.key)} sx={{
        justifyContent: mini ? 'center' : 'initial',
        px: mini ? 1 : 2.5,
        ...(selected === nav.key && {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
        }),
        '&:hover': {
          bgcolor: selected === nav.key ? 'primary.dark' : 'action.hover',
        },
      }}>
        <ListItemIcon sx={{ minWidth: 0, mr: mini ? 0 : 2, justifyContent: 'center' }}>
          {nav.icon}
        </ListItemIcon>
        {!mini && <ListItemText primary={nav.label} />}
      </ListItemButton>
    </ListItem>
  ))}
</List>
      <Box sx={{ flexGrow: 1 }} />
    </Drawer>
  );
}

Sidebar.propTypes = {
  mini: PropTypes.bool.isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onMiniToggle: PropTypes.func.isRequired,
};
