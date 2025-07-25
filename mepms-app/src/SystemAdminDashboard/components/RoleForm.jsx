import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function RoleForm({ open, onClose, onSave, role }) {
  const [form, setForm] = useState({ roleName: '', description: '' });

  useEffect(() => {
    setForm(role || { roleName: '', description: '' });
  }, [role]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{role ? 'Edit Role' : 'Add Role'}</DialogTitle>
      <DialogContent>
        <TextField
          name="roleName"
          autoFocus
          margin="dense"
          label="Role Name"
          fullWidth
          variant="outlined"
          value={form.roleName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="description"
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={form.description}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {role ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RoleForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  role: PropTypes.object,
};
