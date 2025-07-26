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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Autocomplete,
  Chip,
  Stack,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { EQUIPMENT_ENDPOINTS, VENDOR_ENDPOINTS } from '../../API_ENDPOINTS/API';
import axios from 'axios';

export default function PurchaseOrderForm({ 
  open, 
  onClose, 
  onSave, 
  order,
  vendors = [],
  equipment = [],
  notifications = []
}) {
  const [form, setForm] = useState({
    poNumber: '',
    vendorId: '',
    dateIssued: dayjs(),
    status: 'Pending',
    requestedBy: '',
    approvedBy: '',
    totalAmount: 0,
    deliveryDate: dayjs().add(7, 'day'),
    paymentStatus: 'Pending',
    items: [],
    notes: '',
    priority: 'Normal'
  });

  const [newItem, setNewItem] = useState({
    equipmentId: '',
    quantity: 1,
    unitPrice: 0,
    searchTerm: ''
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [filteredEquipment, setFilteredEquipment] = useState(equipment);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrderData = async () => {
      setLoading(true);
      try {
        if (order) {
          // Fetch equipment details for each item
          const itemsWithEquipment = await Promise.all(
            (order.items || []).map(async (item) => {
              try {
                const equipmentRes = await axios.get(EQUIPMENT_ENDPOINTS.GET_BY_ID(item.equipmentId));
                return {
                  ...item,
                  equipmentName: equipmentRes.data.name,
                  equipmentModel: equipmentRes.data.model,
                  serialNumber: equipmentRes.data.serialNumber
                };
              } catch (error) {
                console.error('Error fetching equipment details:', error);
                return {
                  ...item,
                  equipmentName: '-',
                  equipmentModel: '-',
                  serialNumber: '-'
                };
              }
            })
          );

          setForm({
            ...order,
            dateIssued: dayjs(order.dateIssued),
            deliveryDate: order.deliveryDate ? dayjs(order.deliveryDate) : null,
            items: itemsWithEquipment,
            totalAmount: itemsWithEquipment.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
          });
        } else {
          setForm({
            poNumber: generatePONumber(),
            vendorId: '',
            dateIssued: dayjs(),
            status: 'Pending',
            requestedBy: '',
            approvedBy: '',
            totalAmount: 0,
            deliveryDate: dayjs().add(7, 'day'),
            paymentStatus: 'Pending',
            items: [],
            notes: '',
            priority: 'Normal'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [order]);

  // const generatePONumber = () => {
  //   const date = new Date().toLocaleDateString();
  //   const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  //   return `PO-${date}-${randomNum}`;
  // };

  const generatePONumber = () => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${year}${month}${day}-${randomNum}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({...form, [name]: value});
  };

  const handleDateChange = (name, value) => {
    setForm({...form, [name]: value});
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({...newItem, [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value});
  };

  const handleEquipmentSearch = (value) => {
    setNewItem({...newItem, searchTerm: value});
    if (value) {
      setFilteredEquipment(
        equipment.filter(e => 
          e.name.toLowerCase().includes(value.toLowerCase()) || 
          e.model.toLowerCase().includes(value.toLowerCase()) ||
          e.serialNumber.toLowerCase().includes(value.toLowerCase())
        ))
    } else {
      setFilteredEquipment(equipment);
    }
  };

  const addItem = () => {
    if (!newItem.equipmentId) return;
    
    const selectedEquipment = equipment.find(e => e.id === newItem.equipmentId);
    const itemTotal = (newItem.quantity || 0) * (newItem.unitPrice || 0);
    
    const updatedItems = [
      ...form.items,
      {
        ...newItem,
        id: Date.now().toString(),
        equipmentName: selectedEquipment?.name || '-',
        equipmentModel: selectedEquipment?.model || '-',
        serialNumber: selectedEquipment?.serialNumber || '-',
        total: itemTotal
      }
    ];
    
    setForm({
      ...form,
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + (item.total || 0), 0)
    });
    
    setNewItem({
      equipmentId: '',
      quantity: 1,
      unitPrice: 0,
      searchTerm: ''
    });
    setFilteredEquipment(equipment);
  };

  const removeItem = (id) => {
    const updatedItems = form.items.filter(item => item.id !== id);
    setForm({
      ...form,
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + item.total, 0)
    });
  };

  // const handleSubmit = () => {
  //   const submissionData = {
  //     ...form,
  //     dateIssued: form.dateIssued.toISOString(),
  //     deliveryDate: form.deliveryDate?.toISOString(),
  //     items: form.items.map(item => ({
  //       equipmentId: item.equipmentId,
  //       quantity: item.quantity,
  //       unitPrice: item.unitPrice
  //     }))
  //   };
    
  //   onSave(submissionData);
  // };
  // In your handleSubmit function

const handleSubmit = () => {
    // Generate PO number if it doesn't exist
    const poNumber = form.poNumber || generatePONumber();
    
    const submissionData = {
      ...form,
      poNumber, // Ensure this is included
      dateIssued: form.dateIssued.toISOString(),
      deliveryDate: form.deliveryDate?.toISOString(),
      items: form.items.map(item => ({
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };
    
    onSave(submissionData);
};

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'success';
      case 'Approved': return 'info';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {order ? 'Edit Purchase Order' : 'Create Purchase Order'}
            </Typography>
            {order && (
              <Tooltip title="Order notifications">
                <IconButton 
                  onClick={() => setShowNotifications(!showNotifications)}
                  color={notifications.length > 0 ? "primary" : "default"}
                >
                  <NotificationsActiveIcon />
                  {notifications.length > 0 && (
                    <Chip 
                      label={notifications.length} 
                      size="small" 
                      sx={{ 
                        position: 'absolute', 
                        top: 5, 
                        right: 5,
                        fontSize: '0.6rem',
                        height: '18px'
                      }} 
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </DialogTitle>
        
        {showNotifications && notifications.length > 0 && (
          <Box sx={{ px: 3, pt: 1 }}>
            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="subtitle2" gutterBottom>
                Order Notifications
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {notifications.map((note, index) => (
                  <li key={index}>
                    <Typography variant="body2">{note.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(note.createdAt).format('MMM D, YYYY h:mm A')}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Alert>
          </Box>
        )}

        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Header Section */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    name="poNumber"
                    label="PO Number"
                    value={form.poNumber}
                    onChange={handleChange}
                    disabled
                    sx={{ width: 200 }}
                  />
                  <FormControl sx={{ width: 200 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      value={form.priority}
                      label="Priority"
                      onChange={handleChange}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Normal">Normal</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <Chip 
                    label={form.priority} 
                    color={getPriorityColor(form.priority)}
                    size="small"
                  />
                </Stack>
              </Grid>

              {/* Vendor and Dates Section */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Vendor *</InputLabel>
                  <Select
                    name="vendorId"
                    value={form.vendorId}
                    label="Vendor *"
                    onChange={handleChange}
                    required
                  >
                    {vendors.map(vendor => (
                      <MenuItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status *</InputLabel>
                  <Select
                    name="status"
                    value={form.status}
                    label="Status *"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date Issued *"
                  value={form.dateIssued}
                  onChange={(date) => handleDateChange('dateIssued', date)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Delivery Date"
                  value={form.deliveryDate}
                  onChange={(date) => handleDateChange('deliveryDate', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Payment and Approval Section */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Payment Status *</InputLabel>
                  <Select
                    name="paymentStatus"
                    value={form.paymentStatus}
                    label="Payment Status *"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Partial">Partial</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="requestedBy"
                  label="Requested By"
                  fullWidth
                  margin="normal"
                  value={form.requestedBy}
                  onChange={handleChange}
                />
              </Grid>

              {/* Only show Approved By if it has a value when editing */}
              {(order && form.approvedBy) && (
                <Grid item xs={12} md={6}>
                  <TextField
                    name="approvedBy"
                    label="Approved By"
                    fullWidth
                    margin="normal"
                    value={form.approvedBy}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  fullWidth
                  margin="normal"
                  value={form.notes}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Order Items Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Order Items
                </Typography>
                
                {/* Add Item Form */}
                <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={5}>
                      <Autocomplete
                        options={filteredEquipment}
                        getOptionLabel={(option) => 
                          `${option.name} (${option.model}) - ${option.serialNumber}`
                        }
                        value={equipment.find(e => e.id === newItem.equipmentId) || null}
                        onChange={(e, newValue) => {
                          setNewItem({
                            ...newItem,
                            equipmentId: newValue?.id || '',
                            unitPrice: newValue?.unitPrice || 0
                          });
                        }}
                        inputValue={newItem.searchTerm}
                        onInputChange={(e, value) => handleEquipmentSearch(value)}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Search Equipment" 
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <SearchIcon color="action" sx={{ mr: 1 }} />
                                  {params.InputProps.startAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        fullWidth
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={2}>
                      <TextField
                        name="quantity"
                        label="Quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={handleItemChange}
                        fullWidth
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={2}>
                      <TextField
                        name="unitPrice"
                        label="Unit Price"
                        type="number"
                        value={newItem.unitPrice}
                        onChange={handleItemChange}
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Button 
                        variant="contained" 
                        onClick={addItem}
                        startIcon={<AddIcon />}
                        disabled={!newItem.equipmentId}
                        fullWidth
                        sx={{ height: '56px' }}
                      >
                        Add Item
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
                
                {/* Items Table */}
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Equipment</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Serial No.</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {form.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.equipmentName}</TableCell>
                          <TableCell>{item.equipmentModel}</TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell align="right">${(item.total || 0).toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              onClick={() => removeItem(item.id)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {form.items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No items added
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h6">
                    Total Amount: ${(form.totalAmount || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!form.vendorId || form.items.length === 0}
            sx={{ minWidth: 120 }}
          >
            {order ? 'Update Order' : 'Create Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

PurchaseOrderForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  order: PropTypes.object,
  vendors: PropTypes.array.isRequired,
  equipment: PropTypes.array.isRequired,
  notifications: PropTypes.array,
};

PurchaseOrderForm.defaultProps = {
  order: null,
  vendors: [],
  equipment: [],
  notifications: []
};