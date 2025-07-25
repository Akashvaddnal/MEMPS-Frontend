import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

export default function EquipmentForm({ 
  open, 
  onClose, 
  onSave, 
  equipment 
}) {
  const [form, setForm] = useState({
    name: '',
    model: '',
    serialNumber: '',
    category: '',
    purchaseDate: null,
    warrantyEndDate: null,
    status: 'Functional',
    location: '',
    vendorId: '',
  });

  useEffect(() => {
    if (equipment) {
      setForm(equipment);
    } else {
      setForm({
        name: '',
        model: '',
        serialNumber: '',
        category: '',
        purchaseDate: null,
        warrantyEndDate: null,
        status: 'Functional',
        location: '',
        vendorId: '',
      });
    }
  }, [equipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{equipment ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Equipment Name"
          fullWidth
          margin="dense"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          name="model"
          label="Model"
          fullWidth
          margin="dense"
          value={form.model}
          onChange={handleChange}
        />
        <TextField
          name="serialNumber"
          label="Serial Number"
          fullWidth
          margin="dense"
          value={form.serialNumber}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={form.category}
            label="Category"
            onChange={handleChange}
          >
            <MenuItem value="Diagnostic">Diagnostic</MenuItem>
            <MenuItem value="Therapeutic">Therapeutic</MenuItem>
          </Select>
        </FormControl>
        <DatePicker
          label="Purchase Date"
          value={form.purchaseDate}
          onChange={(date) => setForm(prev => ({ ...prev, purchaseDate: date }))}
          renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={form.status}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value="Functional">Functional</MenuItem>
            <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
            <MenuItem value="Out of Service">Out of Service</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(form)} variant="contained">
          {equipment ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EquipmentForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  equipment: PropTypes.object,
};