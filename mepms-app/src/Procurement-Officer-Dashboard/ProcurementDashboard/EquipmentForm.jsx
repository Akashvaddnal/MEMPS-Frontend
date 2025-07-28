// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   MenuItem,
//   InputLabel,
//   Select,
//   FormControl,
//   Grid,
// } from '@mui/material';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';

// export default function EquipmentForm({ 
//   open, 
//   onClose, 
//   onSave, 
//   equipment,
//   vendors 
// }) {
//   const [form, setForm] = useState({
//     name: '',
//     model: '',
//     serialNumber: '',
//     category: '',
//     purchaseDate: dayjs(),
//     warrantyEndDate: dayjs().add(1, 'year'),
//     status: 'Functional',
//     location: '',
//     vendorId: '',
//   });

//   useEffect(() => {
//     if (equipment) {
//       setForm({
//         ...equipment,
//         purchaseDate: equipment.purchaseDate ? dayjs(equipment.purchaseDate) : dayjs(),
//         warrantyEndDate: equipment.warrantyEndDate ? dayjs(equipment.warrantyEndDate) : dayjs().add(1, 'year')
//       });
//     } else {
//       setForm({
//         name: '',
//         model: '',
//         serialNumber: '',
//         category: '',
//         purchaseDate: dayjs(),
//         warrantyEndDate: dayjs().add(1, 'year'),
//         status: 'Functional',
//         location: '',
//         vendorId: '',
//       });
//     }
//   }, [equipment]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDateChange = (name, value) => {
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//     const data = {
//       ...form,
//       purchaseDate: form.purchaseDate.toISOString(),
//       warrantyEndDate: form.warrantyEndDate.toISOString()
//     };
//     onSave(data);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//         <DialogTitle>{equipment ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 name="name"
//                 label="Equipment Name"
//                 fullWidth
//                 margin="normal"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 name="model"
//                 label="Model"
//                 fullWidth
//                 margin="normal"
//                 value={form.model}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 name="serialNumber"
//                 label="Serial Number"
//                 fullWidth
//                 margin="normal"
//                 value={form.serialNumber}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <FormControl fullWidth margin="normal">
//                 <InputLabel>Category *</InputLabel>
//                 <Select
//                   name="category"
//                   value={form.category}
//                   label="Category *"
//                   onChange={handleChange}
//                   required
//                 >
//                   <MenuItem value="Diagnostic">Diagnostic</MenuItem>
//                   <MenuItem value="Therapeutic">Therapeutic</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <FormControl fullWidth margin="normal">
//                 <InputLabel>Status *</InputLabel>
//                 <Select
//                   name="status"
//                   value={form.status}
//                   label="Status *"
//                   onChange={handleChange}
//                   required
//                 >
//                   <MenuItem value="Functional">Functional</MenuItem>
//                   <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
//                   <MenuItem value="Out of Service">Out of Service</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <DatePicker
//                 label="Purchase Date *"
//                 value={form.purchaseDate}
//                 onChange={(date) => handleDateChange('purchaseDate', date)}
//                 slotProps={{ textField: { fullWidth: true, required: true, margin: 'normal' } }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <DatePicker
//                 label="Warranty End Date *"
//                 value={form.warrantyEndDate}
//                 onChange={(date) => handleDateChange('warrantyEndDate', date)}
//                 slotProps={{ textField: { fullWidth: true, required: true, margin: 'normal' } }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 name="location"
//                 label="Location"
//                 fullWidth
//                 margin="normal"
//                 value={form.location}
//                 onChange={handleChange}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <FormControl fullWidth margin="normal">
//                 <InputLabel>Vendor</InputLabel>
//                 <Select
//                   name="vendorId"
//                   value={form.vendorId}
//                   label="Vendor"
//                   onChange={handleChange}
//                 >
//                   {vendors.map(vendor => (
//                     <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained">
//             {equipment ? 'Update' : 'Create'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </LocalizationProvider>
//   );
// }

// EquipmentForm.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSave: PropTypes.func.isRequired,
//   equipment: PropTypes.object,
//   vendors: PropTypes.array.isRequired,
// };

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
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function EquipmentForm({ 
  open, 
  onClose, 
  onSave, 
  equipment,
  vendors 
}) {
  const [form, setForm] = useState({
    name: '',
    model: '',
    serialNumber: '',
    category: '',
    status: 'Functional',
    location: '',
    createdAt: dayjs(),
    updatedAt: dayjs(),
  });

  useEffect(() => {
    if (equipment) {
      setForm({
        name: equipment.name || '',
        model: equipment.model || '',
        serialNumber: equipment.serialNumber || '',
        category: equipment.category || '',
        status: equipment.status || 'Functional',
        location: equipment.location || '',
        createdAt: equipment.createdAt ? dayjs(equipment.createdAt) : dayjs(),
        updatedAt: dayjs(),
      });
    } else {
      setForm({
        name: '',
        model: '',
        serialNumber: '',
        category: '',
        status: 'Functional',
        location: '',
        createdAt: dayjs(),
        updatedAt: dayjs(),
      });
    }
  }, [equipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString()
    };
    onSave(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{equipment ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Equipment Name *"
                fullWidth
                margin="normal"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="model"
                label="Model *"
                fullWidth
                margin="normal"
                value={form.model}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="serialNumber"
                label="Serial Number *"
                fullWidth
                margin="normal"
                value={form.serialNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category *</InputLabel>
                <Select
                  name="category"
                  value={form.category}
                  label="Category *"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Diagnostic">Diagnostic</MenuItem>
                  <MenuItem value="Therapeutic">Therapeutic</MenuItem>
                  <MenuItem value="Monitoring">Monitoring</MenuItem>
                  <MenuItem value="Surgical">Surgical</MenuItem>
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
                  <MenuItem value="Functional">Functional</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  <MenuItem value="Out of Service">Out of Service</MenuItem>
                  <MenuItem value="In Storage">In Storage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                margin="normal"
                value={form.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Created At"
                value={form.createdAt}
                onChange={(date) => handleDateChange('createdAt', date)}
                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Updated At"
                value={form.updatedAt}
                onChange={(date) => handleDateChange('updatedAt', date)}
                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!form.name || !form.model || !form.serialNumber || !form.category || !form.status}
          >
            {equipment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

EquipmentForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  equipment: PropTypes.object,
  vendors: PropTypes.array.isRequired,
};