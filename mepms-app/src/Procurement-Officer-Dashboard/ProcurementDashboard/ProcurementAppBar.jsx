import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggleButton from '../common/ThemeToggleButton';
import AccountMenu from '../common/AccountMenu';
const handleSignOut = () => {
    // Clear token and optionally redirect to login page
    localStorage.removeItem("authToken");
    window.location.href = "/login";  // Adjust path as needed
  };
export default function ProcurementAppBar({ 
  title, 
  mode, 
  onToggleMode, 
  onToggleSidebar,
  user
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
          {title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <ThemeToggleButton toggleColorMode={onToggleMode} />
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar alt={user?.name} src={user?.profilePic} />
          </IconButton>
          <AccountMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
           onSignOut={handleSignOut}
            user={user || { name: '', email: '' }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

ProcurementAppBar.propTypes = {
  title: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  onToggleMode: PropTypes.func.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
  user: PropTypes.object,
};