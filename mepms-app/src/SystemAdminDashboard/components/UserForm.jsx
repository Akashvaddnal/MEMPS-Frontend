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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function UserForm({ open, onClose, onSave, user }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    department: '',
    roleName: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(user);
    } else {
      setForm({
        username: '',
        email: '',
        password: '',
        department: '',
        roleName: '',
      });
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
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
