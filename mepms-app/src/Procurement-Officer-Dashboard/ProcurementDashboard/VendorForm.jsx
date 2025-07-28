// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Grid,
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

//   const handleSubmit = () => {
//     onSave(form);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>{vendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           <Grid item xs={12}>
//             <TextField
//               name="name"
//               label="Vendor Name *"
//               fullWidth
//               margin="normal"
//               value={form.name}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               name="contactPerson"
//               label="Contact Person *"
//               fullWidth
//               margin="normal"
//               value={form.contactPerson}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               name="email"
//               label="Email *"
//               fullWidth
//               margin="normal"
//               value={form.email}
//               onChange={handleChange}
//               type="email"
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               name="phone"
//               label="Phone *"
//               fullWidth
//               margin="normal"
//               value={form.phone}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               name="address"
//               label="Address"
//               fullWidth
//               margin="normal"
//               value={form.address}
//               onChange={handleChange}
//               multiline
//               rows={3}
//             />
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant="outlined">
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained" 
//           color="primary"
//           disabled={!form.name || !form.contactPerson || !form.email || !form.phone}
//         >
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

// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   Box,
// } from '@mui/material';

// export default function VendorForm({ 
//   open, 
//   onClose, 
//   onSave, 
//   vendor,
//   equipmentList=[]
// }) {
//   const [form, setForm] = useState({
//     name: '',
//     contactPerson: '',
//     email: '',
//     phone: '',
//     address: '',
//     equipmentProvided: [],
//   });

//   const [availableEquipment, setAvailableEquipment] = useState([]);
//   const [equipmentSearch, setEquipmentSearch] = useState('');

//   useEffect(() => {
//     if (vendor) {
//       setForm({
//         name: vendor.name || '',
//         contactPerson: vendor.contactPerson || '',
//         email: vendor.email || '',
//         phone: vendor.phone || '',
//         address: vendor.address || '',
//         equipmentProvided: vendor.equipmentProvided || [],
//       });
//     } else {
//       setForm({
//         name: '',
//         contactPerson: '',
//         email: '',
//         phone: '',
//         address: '',
//         equipmentProvided: [],
//       });
//     }
    
//     // Filter available equipment
//     const assignedIds = vendor?.equipmentProvided || [];
//     const available = equipmentList.filter(eq => !assignedIds.includes(eq._id));
//     setAvailableEquipment(available);
//   }, [vendor, equipmentList]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddEquipment = (equipmentId) => {
//     if (!form.equipmentProvided.includes(equipmentId)) {
//       setForm(prev => ({
//         ...prev,
//         equipmentProvided: [...prev.equipmentProvided, equipmentId]
//       }));
//     }
//   };

//   const handleRemoveEquipment = (equipmentId) => {
//     setForm(prev => ({
//       ...prev,
//       equipmentProvided: prev.equipmentProvided.filter(id => id !== equipmentId)
//     }));
//   };

//   const handleSubmit = () => {
//     onSave(form);
//   };

//   const filteredAvailableEquipment = availableEquipment.filter(eq => 
//     eq.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
//     eq.serialNumber.toLowerCase().includes(equipmentSearch.toLowerCase())
//   );

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>{vendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           <Grid item xs={12} md={6}>
//             <TextField
//               name="name"
//               label="Vendor Name *"
//               fullWidth
//               margin="normal"
//               value={form.name}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               name="contactPerson"
//               label="Contact Person *"
//               fullWidth
//               margin="normal"
//               value={form.contactPerson}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               name="email"
//               label="Email *"
//               fullWidth
//               margin="normal"
//               value={form.email}
//               onChange={handleChange}
//               type="email"
//               required
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               name="phone"
//               label="Phone *"
//               fullWidth
//               margin="normal"
//               value={form.phone}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               name="address"
//               label="Address"
//               fullWidth
//               margin="normal"
//               value={form.address}
//               onChange={handleChange}
//               multiline
//               rows={3}
//             />
//           </Grid>
          
//           {/* Equipment Management Section */}
//           <Grid item xs={12}>
//             <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
//               <Box sx={{ mb: 2 }}>
//                 <TextField
//                   label="Search Equipment"
//                   fullWidth
//                   margin="normal"
//                   value={equipmentSearch}
//                   onChange={(e) => setEquipmentSearch(e.target.value)}
//                   size="small"
//                 />
//               </Box>
              
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
//                     <Box sx={{ fontWeight: 'bold', mb: 1 }}>Available Equipment</Box>
//                     {filteredAvailableEquipment.length > 0 ? (
//                       filteredAvailableEquipment.map(eq => (
//                         <Box 
//                           key={eq._id} 
//                           sx={{ 
//                             display: 'flex', 
//                             justifyContent: 'space-between', 
//                             alignItems: 'center', 
//                             mb: 1,
//                             p: 1,
//                             '&:hover': { backgroundColor: '#f5f5f5' }
//                           }}
//                         >
//                           <span>{eq.name} ({eq.serialNumber})</span>
//                           <Button 
//                             size="small" 
//                             variant="outlined"
//                             onClick={() => handleAddEquipment(eq._id)}
//                           >
//                             Add
//                           </Button>
//                         </Box>
//                       ))
//                     ) : (
//                       <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
//                         No available equipment
//                       </Box>
//                     )}
//                   </Box>
//                 </Grid>
                
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
//                     <Box sx={{ fontWeight: 'bold', mb: 1 }}>Assigned Equipment ({form.equipmentProvided.length})</Box>
//                     {form.equipmentProvided.length > 0 ? (
//                       form.equipmentProvided.map(id => {
//                         const eq = equipmentList.find(e => e._id === id);
//                         return eq ? (
//                           <Box 
//                             key={id} 
//                             sx={{ 
//                               display: 'flex', 
//                               justifyContent: 'space-between', 
//                               alignItems: 'center', 
//                               mb: 1,
//                               p: 1,
//                               '&:hover': { backgroundColor: '#f5f5f5' }
//                             }}
//                           >
//                             <span>{eq.name} ({eq.serialNumber})</span>
//                             <Button 
//                               size="small" 
//                               variant="outlined"
//                               color="error"
//                               onClick={() => handleRemoveEquipment(id)}
//                             >
//                               Remove
//                             </Button>
//                           </Box>
//                         ) : null;
//                       })
//                     ) : (
//                       <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
//                         No equipment assigned
//                       </Box>
//                     )}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant="outlined">
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained" 
//           color="primary"
//           disabled={!form.name || !form.contactPerson || !form.email || !form.phone}
//         >
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
//   equipmentList: PropTypes.array.isRequired,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material';

export default function VendorForm({ 
  open, 
  onClose, 
  onSave, 
  vendor,
  equipmentList = [] // Provide default empty array
}) {
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    equipmentProvided: [],
  });

  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      try {
        if (vendor) {
          setForm({
            name: vendor.name || '',
            contactPerson: vendor.contactPerson || '',
            email: vendor.email || '',
            phone: vendor.phone || '',
            address: vendor.address || '',
            equipmentProvided: vendor.equipmentProvided || [],
          });
        } else {
          setForm({
            name: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
            equipmentProvided: [],
          });
        }
        
        // Safely filter available equipment
        const assignedIds = vendor?.equipmentProvided || [];
        const available = Array.isArray(equipmentList) 
          ? equipmentList.filter(eq => !assignedIds.includes(eq._id))
          : [];
        setAvailableEquipment(available);
      } catch (error) {
        console.error('Error initializing form:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [open, vendor, equipmentList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEquipment = (equipmentId) => {
    if (!form.equipmentProvided.includes(equipmentId)) {
      setForm(prev => ({
        ...prev,
        equipmentProvided: [...prev.equipmentProvided, equipmentId]
      }));
      // Update available equipment
      setAvailableEquipment(prev => prev.filter(eq => eq._id !== equipmentId));
    }
  };

  const handleRemoveEquipment = (equipmentId) => {
    setForm(prev => ({
      ...prev,
      equipmentProvided: prev.equipmentProvided.filter(id => id !== equipmentId)
    }));
    // Add back to available equipment if it exists in the full list
    const eqToAddBack = equipmentList.find(eq => eq._id === equipmentId);
    if (eqToAddBack) {
      setAvailableEquipment(prev => [...prev, eqToAddBack]);
    }
  };

  const handleSubmit = () => {
    onSave(form);
  };

  const filteredAvailableEquipment = availableEquipment.filter(eq => 
    eq?.name?.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
    eq?.serialNumber?.toLowerCase().includes(equipmentSearch.toLowerCase())
  );

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{vendor ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
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
          
          {/* Equipment Management Section */}
          <Grid item xs={12}>
            <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Search Equipment"
                  fullWidth
                  margin="normal"
                  value={equipmentSearch}
                  onChange={(e) => setEquipmentSearch(e.target.value)}
                  size="small"
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                    <Box sx={{ fontWeight: 'bold', mb: 1 }}>Available Equipment</Box>
                    {filteredAvailableEquipment.length > 0 ? (
                      filteredAvailableEquipment.map(eq => (
                        <Box 
                          key={eq._id} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 1,
                            p: 1,
                            '&:hover': { backgroundColor: '#f5f5f5' }
                          }}
                        >
                          <span>{eq.name} ({eq.serialNumber})</span>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => handleAddEquipment(eq._id)}
                          >
                            Add
                          </Button>
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        No available equipment
                      </Box>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto' }}>
                    <Box sx={{ fontWeight: 'bold', mb: 1 }}>Assigned Equipment ({form.equipmentProvided.length})</Box>
                    {form.equipmentProvided.length > 0 ? (
                      form.equipmentProvided.map(id => {
                        const eq = equipmentList.find(e => e._id === id);
                        return eq ? (
                          <Box 
                            key={id} 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              mb: 1,
                              p: 1,
                              '&:hover': { backgroundColor: '#f5f5f5' }
                            }}
                          >
                            <span>{eq.name} ({eq.serialNumber})</span>
                            <Button 
                              size="small" 
                              variant="outlined"
                              color="error"
                              onClick={() => handleRemoveEquipment(id)}
                            >
                              Remove
                            </Button>
                          </Box>
                        ) : null;
                      })
                    ) : (
                      <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        No equipment assigned
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
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
  equipmentList: PropTypes.array,
};

VendorForm.defaultProps = {
  equipmentList: [],
};