import React from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder, 
  sx 
}) {
  return (
    <TextField
      variant="outlined"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Search...'}
      sx={{ 
        width: 300,
        maxWidth: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx 
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
};