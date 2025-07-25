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
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

export default function PurchaseOrderForm({ 
  open, 
  onClose, 
  onSave, 
  order,
  vendors
}) {
  const [form, setForm] = useState({
    poNumber: '',
    vendorId: '',
    dateIssued: new Date(),
    status: 'Pending',
    requestedBy: '',
    approvedBy: '',
    totalAmount: 0,
    deliveryDate: null,
    paymentStatus: 'Pending',
  });

  useEffect(() => {
    if (order) {
      setForm(order);
    } else {
      setForm({
        poNumber: `PO-${Math.floor(Math.random() * 10000)}`,
        vendorId: '',
        dateIssued: new Date(),
        status: 'Pending',
        requestedBy: '',
        approvedBy: '',
        totalAmount: 0,
        deliveryDate: null,
        paymentStatus: 'Pending',
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{order ? 'Edit Purchase Order' : 'Create Purchase Order'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              name="poNumber"
              label="PO Number"
              fullWidth
              margin="dense"
              value={form.poNumber}
              onChange={handleChange}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Vendor</InputLabel>
              <Select
                name="vendorId"
                value={form.vendorId}
                label="Vendor"
                onChange={handleChange}
              >
                {vendors.map(vendor => (
                  <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Date Issued"
              value={form.dateIssued}
              onChange={(date) => setForm(prev => ({ ...prev, dateIssued: date }))}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={form.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Order Items</Typography>
            {/* Order items table would go here */}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(form)} variant="contained" color="primary">
          {order ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PurchaseOrderForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  order: PropTypes.object,
  vendors: PropTypes.array.isRequired,
};