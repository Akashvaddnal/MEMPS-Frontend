import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Box,
} from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function UserForm({ open, onClose, onSave, user }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    department: '',
    roleName: '',
    profilePic: '', // Base64 string
  });
  const [showPassword, setShowPassword] = useState(false);

  // We keep track of selected file to trigger conversion or reset
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    if (user) {
      setForm(user);
      setProfilePicFile(null);
    } else {
      setForm({
        username: '',
        email: '',
        password: '',
        department: '',
        roleName: '',
        profilePic: '',
      });
      setProfilePicFile(null);
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Handle image file selection and convert to base64
  const handleProfilePicChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePicFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result is a base64 encoded data URL: "data:image/...;base64,..."
      // If you want to store only base64 string without prefix, strip it:
      // const base64String = reader.result.split(',')[1];
      // Here we store full data URL for ease of preview and storage.
      setForm(f => ({ ...f, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        {/* Image preview */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar
            src={form.profilePic || ''}
            alt={form.username || 'Profile Picture'}
            sx={{ width: 80, height: 80 }}
          />
        </Box>

        {/* Upload button + hidden file input */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mb: 2 }}
        >
          Upload Profile Picture
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfilePicChange}
          />
        </Button>

        <TextField
          name="username"
          autoFocus
          margin="dense"
          label="Username"
          fullWidth
          variant="outlined"
          value={form.username}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="email"
          margin="dense"
          label="Email"
          fullWidth
          variant="outlined"
          value={form.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="password"
          margin="dense"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          value={form.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  size="small"
                >
                  <VisibilityOffIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="department"
          margin="dense"
          label="Department"
          fullWidth
          variant="outlined"
          value={form.department}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="roleName"
          margin="dense"
          label="Role"
          fullWidth
          variant="outlined"
          value={form.roleName}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {user ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UserForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  user: PropTypes.object,
};
