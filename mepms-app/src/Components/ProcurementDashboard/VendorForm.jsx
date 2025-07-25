import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

export default function VendorForm({ 
  open, 
  onClose, 
  onSave, 
  vendor 
}) {
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (vendor) {
      setForm(vendor);
    } else {
      setForm({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [vendor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{vendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Vendor Name"
          fullWidth
          margin="dense"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          name="contactPerson"
          label="Contact Person"
          fullWidth
          margin="dense"
          value={form.contactPerson}
          onChange={handleChange}
        />
        <TextField
          name="email"
          label="Email"
          fullWidth
          margin="dense"
          value={form.email}
          onChange={handleChange}
          type="email"
        />
        <TextField
          name="phone"
          label="Phone"
          fullWidth
          margin="dense"
          value={form.phone}
          onChange={handleChange}
        />
        <TextField
          name="address"
          label="Address"
          fullWidth
          margin="dense"
          value={form.address}
          onChange={handleChange}
          multiline
          rows={3}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(form)} variant="contained" color="primary">
          {vendor ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

VendorForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  vendor: PropTypes.object,
};