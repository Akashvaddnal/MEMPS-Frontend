// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
// } from '@mui/material';

// export default function VendorForm({ 
//   open, 
//   onClose, 
//   onSave, 
//   vendor 
// }) {
//   const [form, setForm] = useState({
//     name: '',
//     contactPerson: '',
//     email: '',
//     phone: '',
//     address: '',
//   });

//   useEffect(() => {
//     if (vendor) {
//       setForm(vendor);
//     } else {
//       setForm({
//         name: '',
//         contactPerson: '',
//         email: '',
//         phone: '',
//         address: '',
//       });
//     }
//   }, [vendor]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>{vendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
//       <DialogContent>
//         <TextField
//           name="name"
//           label="Vendor Name"
//           fullWidth
//           margin="dense"
//           value={form.name}
//           onChange={handleChange}
//         />
//         <TextField
//           name="contactPerson"
//           label="Contact Person"
//           fullWidth
//           margin="dense"
//           value={form.contactPerson}
//           onChange={handleChange}
//         />
//         <TextField
//           name="email"
//           label="Email"
//           fullWidth
//           margin="dense"
//           value={form.email}
//           onChange={handleChange}
//           type="email"
//         />
//         <TextField
//           name="phone"
//           label="Phone"
//           fullWidth
//           margin="dense"
//           value={form.phone}
//           onChange={handleChange}
//         />
//         <TextField
//           name="address"
//           label="Address"
//           fullWidth
//           margin="dense"
//           value={form.address}
//           onChange={handleChange}
//           multiline
//           rows={3}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={() => onSave(form)} variant="contained" color="primary">
//           {vendor ? 'Update' : 'Create'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// VendorForm.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSave: PropTypes.func.isRequired,
//   vendor: PropTypes.object,
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
  Grid,
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

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{vendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Vendor Name *"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="contactPerson"
              label="Contact Person *"
              fullWidth
              margin="normal"
              value={form.contactPerson}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email *"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="phone"
              label="Phone *"
              fullWidth
              margin="normal"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              fullWidth
              margin="normal"
              value={form.address}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!form.name || !form.contactPerson || !form.email || !form.phone}
        >
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