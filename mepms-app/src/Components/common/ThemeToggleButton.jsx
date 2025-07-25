import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, useTheme, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function ThemeToggleButton({ toggleColorMode }) {
  const theme = useTheme();

  return (
    <Tooltip 
      title={theme.palette.mode === 'dark' ? 'Light mode' : 'Dark mode'}
      arrow
    >
      <IconButton 
        onClick={toggleColorMode} 
        color="inherit"
        sx={{
          ml: 1,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        {theme.palette.mode === 'dark' ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
}

ThemeToggleButton.propTypes = {
  toggleColorMode: PropTypes.func.isRequired,
};