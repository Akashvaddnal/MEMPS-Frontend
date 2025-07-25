import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, Box, Stack, Avatar, Typography, Divider } from '@mui/material';

export default function AccountMenu({ anchorEl, open, onClose, onSignOut, user }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box sx={{ p: 1.5, minWidth: 220 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={user.image} alt={user.name} />
          <Box>
            <Typography fontWeight="bold">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Divider />
      <MenuItem onClick={onSignOut}>Sign out</MenuItem>
    </Menu>
  );
}

AccountMenu.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};
