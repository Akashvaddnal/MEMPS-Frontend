import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { VENDOR_ENDPOINTS } from '../../API_ENDPOINTS/API';

export default function VendorEquipmentDialog({
  open,
  onClose,
  vendorId,
  vendorName,
  equipmentList,
  allEquipment,
  onAddEquipment,
  onRemoveEquipment,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    if (vendorId && equipmentList) {
      const assignedIds = equipmentList.map(eq => eq._id);
      const available = allEquipment.filter(
        eq => !assignedIds.includes(eq._id) &&
          eq.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAvailableEquipment(available);
    }
  }, [vendorId, equipmentList, allEquipment, searchTerm]);

  const handleAdd = () => {
    if (selectedEquipment) {
      onAddEquipment(vendorId, selectedEquipment._id);
      setSelectedEquipment(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Equipment for {vendorName}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Currently Assigned Equipment
          </Typography>
          {equipmentList.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Serial Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {equipmentList.map(equipment => (
                    <TableRow key={equipment._id}>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell>{equipment.model}</TableCell>
                      <TableCell>{equipment.serialNumber}</TableCell>
                      <TableCell>
                        <Chip 
                          label={equipment.status} 
                          size="small" 
                          color={
                            equipment.status === 'Functional' ? 'success' :
                            equipment.status === 'Under Maintenance' ? 'warning' :
                            'error'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => onRemoveEquipment(vendorId, equipment._id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
              No equipment assigned to this vendor
            </Box>
          )}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Add New Equipment
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Search Equipment"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          
          {availableEquipment.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Serial Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableEquipment.map(equipment => (
                    <TableRow 
                      key={equipment._id}
                      selected={selectedEquipment?._id === equipment._id}
                      onClick={() => setSelectedEquipment(equipment)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell>{equipment.model}</TableCell>
                      <TableCell>{equipment.serialNumber}</TableCell>
                      <TableCell>
                        <Chip 
                          label={equipment.status} 
                          size="small" 
                          color={
                            equipment.status === 'Functional' ? 'success' :
                            equipment.status === 'Under Maintenance' ? 'warning' :
                            'error'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          variant="outlined"
                          disabled={selectedEquipment?._id !== equipment._id}
                          onClick={handleAdd}
                        >
                          Add to Vendor
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
              {searchTerm ? 'No matching equipment found' : 'No available equipment'}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

VendorEquipmentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vendorId: PropTypes.string.isRequired,
  vendorName: PropTypes.string.isRequired,
  equipmentList: PropTypes.array.isRequired,
  allEquipment: PropTypes.array.isRequired,
  onAddEquipment: PropTypes.func.isRequired,
  onRemoveEquipment: PropTypes.func.isRequired,
};