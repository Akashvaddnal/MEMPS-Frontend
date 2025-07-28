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
import { EQUIPMENT_ENDPOINTS, VENDOR_ENDPOINTS, PURCHASE_ORDER_ITEM_ENDPOINTS } from '../../API_ENDPOINTS/API';
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
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    const loadOrderData = async () => {
      setLoading(true);
      try {
        if (order) {
          // First fetch the purchase order items
          let orderItems = [];
          try {
            const itemsResponse = await axios.get(
              PURCHASE_ORDER_ITEM_ENDPOINTS.GET_BY_PO_ID(order._id || order.id)
            );
            orderItems = itemsResponse.data;
          } catch (error) {
            console.error('Error fetching order items:', error);
          }

          // Map items with equipment details
          const itemsWithEquipment = await Promise.all(
            orderItems.map(async (item) => {
              try {
                // Find equipment in the equipment prop first (more efficient)
                const foundEquipment = equipment.find(e => e._id === item.equipmentId);
                
                if (foundEquipment) {
                  return {
                    ...item,
                    id: item._id || item.id, // Ensure we have an id field
                    equipmentName: foundEquipment.name,
                    equipmentModel: foundEquipment.model,
                    serialNumber: foundEquipment.serialNumber,
                    total: item.total || (item.quantity * item.unitPrice)
                  };
                }

                // Fallback to API call if not found in local equipment list
                const equipmentRes = await axios.get(
                  EQUIPMENT_ENDPOINTS.GET_BY_ID(item.equipmentId)
                );
                return {
                  ...item,
                  id: item._id || item.id, // Ensure we have an id field
                  equipmentName: equipmentRes.data.name,
                  equipmentModel: equipmentRes.data.model,
                  serialNumber: equipmentRes.data.serialNumber,
                  total: item.total || (item.quantity * item.unitPrice)
                };
              } catch (error) {
                console.error('Error fetching equipment details:', error);
                return {
                  ...item,
                  id: item._id || item.id, // Ensure we have an id field
                  equipmentName: 'Equipment not found',
                  equipmentModel: '-',
                  serialNumber: '-',
                  total: item.total || (item.quantity * item.unitPrice)
                };
              }
            })
          );

          console.log('Original order data:', order);
          console.log('Order items from API:', orderItems);
          console.log('Processed items:', itemsWithEquipment);

          const currentVendor = vendors.find(v => v._id === order.vendorId);
          setSelectedVendor(currentVendor);

          // Filter equipment based on vendor's equipment_provided array
          const vendorEquipment = currentVendor?.equipmentProvided 
            ? equipment.filter(e => currentVendor.equipmentProvided.includes(e._id))
            : [];

          setFilteredEquipment(vendorEquipment);

          setForm({
            poNumber: order.poNumber,
            vendorId: order.vendorId,
            dateIssued: dayjs(order.dateIssued),
            status: order.status,
            requestedBy: order.requestedBy,
            approvedBy: order.approvedBy,
            totalAmount: order.totalAmount || itemsWithEquipment.reduce((sum, item) => sum + (item.total || 0), 0),
            deliveryDate: order.deliveryDate ? dayjs(order.deliveryDate) : null,
            paymentStatus: order.paymentStatus,
            items: itemsWithEquipment,
            notes: order.notes,
            priority: order.priority || 'Normal'
          });
        } else {
          // For new order
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
          setSelectedVendor(null);
          setFilteredEquipment([]);
        }
      } catch (error) {
        console.error('Error loading order data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadOrderData();
    }
  }, [order, equipment, vendors, open]);
  
  const generatePONumber = () => {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${year}${month}${day}-${randomNum}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'vendorId') {
      const vendor = vendors.find(v => v._id === value);
      setSelectedVendor(vendor);

      // Filter equipment based on vendor's equipment_provided array
      const vendorEquipment = vendor?.equipmentProvided 
        ? equipment.filter(e => vendor.equipmentProvided.includes(e._id))
        : [];
      
      setFilteredEquipment(vendorEquipment);
      
      // Clear any selected equipment that doesn't belong to the new vendor
      if (newItem.equipmentId) {
        const isEquipmentValid = vendor?.equipmentProvided?.includes(newItem.equipmentId);
        if (!isEquipmentValid) {
          setNewItem(prev => ({
            ...prev,
            equipmentId: '',
            unitPrice: 0,
            searchTerm: ''
          }));
        }
      }

      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }

    console.log('Selected Vendor:', selectedVendor);
    console.log('Vendor Equipment IDs:', selectedVendor?.equipmentProvided);
    console.log('Filtered Equipment:', filteredEquipment);
    console.log('All Equipment:', equipment);
  };

  const handleDateChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value
    }));
  };

  const handleEquipmentSearch = (value) => {
    setNewItem(prev => ({
      ...prev,
      searchTerm: value
    }));
    
    if (value && selectedVendor?.equipmentProvided) {
      const filtered = equipment.filter(e => 
        selectedVendor.equipmentProvided.includes(e._id) &&
        (e.name?.toLowerCase().includes(value.toLowerCase()) || 
         e.model?.toLowerCase().includes(value.toLowerCase()) ||
         e.serialNumber?.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredEquipment(filtered);
    } else if (selectedVendor?.equipmentProvided) {
      setFilteredEquipment(
        equipment.filter(e => selectedVendor.equipmentProvided.includes(e._id))
      );
    } else {
      setFilteredEquipment([]);
    }

    console.log('Selected Vendor:', selectedVendor);
    console.log('Vendor Equipment IDs:', selectedVendor?.equipmentProvided);
    console.log('Filtered Equipment:', filteredEquipment);
    console.log('All Equipment:', equipment);
  };

  const addItem = () => {
    if (!newItem.equipmentId) return;
    
    const selectedEquipment = equipment.find(e => e._id === newItem.equipmentId);
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
    
    setForm(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + (item.total || 0), 0)
    }));
    
    setNewItem({
      equipmentId: '',
      quantity: 1,
      unitPrice: 0,
      searchTerm: ''
    });
    
    // Reset filtered equipment to vendor's full equipment list
    if (selectedVendor?.equipmentProvided) {
      setFilteredEquipment(
        equipment.filter(e => selectedVendor.equipmentProvided.includes(e._id))
      );
    }
  };

  const removeItem = (id) => {
    const updatedItems = form.items.filter(item => item.id !== id);
    setForm(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + item.total, 0)
    }));
  };

  const handleSubmit = () => {
    const poNumber = order ? form.poNumber : generatePONumber();
    
    const submissionData = {
      ...form,
      poNumber,
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
              {order ? 'Edit Purchase Order' : 'Create New Purchase Order'}
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
              {/* Header Section - Only show PO Number for edit mode */}
              {order && (
                <Grid item xs={12}>
                  <TextField
                    name="poNumber"
                    label="PO Number"
                    value={form.poNumber}
                    onChange={handleChange}
                    fullWidth
                    disabled
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="priority-label">Priority Level</InputLabel>
                    <Select
                      name="priority"
                      value={form.priority}
                      label="Priority Level"
                      onChange={handleChange}
                    >
                      <MenuItem value="High">High Priority</MenuItem>
                      <MenuItem value="Medium">Medium Priority</MenuItem>
                      <MenuItem value="Normal">Normal Priority</MenuItem>
                      <MenuItem value="Low">Low Priority</MenuItem>
                    </Select>
                  </FormControl>
                  <Chip 
                    label={form.priority} 
                    color={getPriorityColor(form.priority)}
                    size="medium"
                  />
                </Stack>
              </Grid>

              {/* Vendor Section */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="vendor-label">Select Vendor *</InputLabel>
                  <Select
                    name="vendorId"
                    value={form.vendorId}
                    label="Select Vendor *"
                    onChange={handleChange}
                    required
                  >
                    {vendors.map(vendor => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        {vendor.name} - {vendor.contact_person}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Status Section */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Order Status *</InputLabel>
                  <Select
                    name="status"
                    value={form.status}
                    label="Order Status *"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Pending">Pending Approval</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Dates Section */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Order Date *"
                  value={form.dateIssued}
                  onChange={(date) => handleDateChange('dateIssued', date)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Expected Delivery Date"
                  value={form.deliveryDate}
                  onChange={(date) => handleDateChange('deliveryDate', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Payment Section */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="payment-status-label">Payment Status *</InputLabel>
                  <Select
                    name="paymentStatus"
                    value={form.paymentStatus}
                    label="Payment Status *"
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Pending">Payment Pending</MenuItem>
                    <MenuItem value="Partial">Partial Payment</MenuItem>
                    <MenuItem value="Paid">Payment Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Requested By Section */}
              <Grid item xs={12} md={6}>
                <TextField
                  name="requestedBy"
                  label="Requested By *"
                  fullWidth
                  value={form.requestedBy}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Approved By Section - Only visible when editing and has value */}
              {(order && form.approvedBy) && (
                <Grid item xs={12} md={6}>
                  <TextField
                    name="approvedBy"
                    label="Approved By"
                    fullWidth
                    value={form.approvedBy}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
              )}

              {/* Notes Section */}
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Order Notes"
                  fullWidth
                  multiline
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Enter any additional notes or instructions for this order"
                />
              </Grid>

              {/* Order Items Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                
                {/* Add Item Form */}
                <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} md={5}>
                      <Typography variant="subtitle2" gutterBottom>
                        Select Equipment
                      </Typography>
                      <Autocomplete
                        options={filteredEquipment}
                        getOptionLabel={(option) => 
                          `${option.name} (${option.model}) - ${option.serialNumber}`
                        }
                        value={equipment.find(e => e._id === newItem.equipmentId) || null}
                        onChange={(e, newValue) => {
                          setNewItem(prev => ({
                            ...prev,
                            equipmentId: newValue?._id || '',
                            unitPrice: newValue?.unitPrice || 0
                          }));
                        }}
                        inputValue={newItem.searchTerm}
                        onInputChange={(e, value) => handleEquipmentSearch(value)}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            placeholder={form.vendorId ? "Search equipment..." : "Please select a vendor first"}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <SearchIcon color="action" sx={{ mr: 1 }} />
                                  {params.InputProps.startAdornment}
                                </>
                              )
                            }}
                            disabled={!form.vendorId}
                          />
                        )}
                        fullWidth
                        noOptionsText={
                          form.vendorId 
                            ? filteredEquipment.length === 0 
                              ? "This vendor has no equipment assigned" 
                              : "No matching equipment found"
                            : "Select a vendor to see equipment"
                        }
                      />
                      {!form.vendorId && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          Please select a vendor above to see available equipment
                        </Typography>
                      )}
                    </Grid>
                    
                    <Grid item xs={6} md={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Quantity
                      </Typography>
                      <TextField
                        name="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={handleItemChange}
                        fullWidth
                        inputProps={{ min: 1 }}
                      />
                    </Grid>
                    
                    <Grid item xs={6} md={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Unit Price ($)
                      </Typography>
                      <TextField
                        name="unitPrice"
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
                        Add to Order
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
                
                {/* Items Table */}
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Equipment</strong></TableCell>
                        <TableCell><strong>Model</strong></TableCell>
                        <TableCell><strong>Serial No.</strong></TableCell>
                        <TableCell align="right"><strong>Quantity</strong></TableCell>
                        <TableCell align="right"><strong>Unit Price ($)</strong></TableCell>
                        <TableCell align="right"><strong>Total ($)</strong></TableCell>
                        <TableCell align="center"><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {form.items.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>{item.equipmentName}</TableCell>
                          <TableCell>{item.equipmentModel}</TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell align="right">{(item.total || 0).toFixed(2)}</TableCell>
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
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                              No items added to this order yet
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="h5">
                    <strong>Total Amount: ${(form.totalAmount || 0).toFixed(2)}</strong>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={onClose} variant="outlined" size="large">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            size="large"
            disabled={!form.vendorId || form.items.length === 0}
            sx={{ minWidth: 200 }}
          >
            {order ? 'Update Purchase Order' : 'Create Purchase Order'}
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