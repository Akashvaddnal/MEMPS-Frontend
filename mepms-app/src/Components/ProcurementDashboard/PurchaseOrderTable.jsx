import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SearchBar from '../common/SearchBar';
import { formatDateTime } from '../Utils/procurementUtils';

export default function PurchaseOrderTable({ 
  orders, 
  onEdit, 
  onView, 
  search, 
  onSearch 
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = orders.filter(order => 
    order.poNumber?.toLowerCase().includes(search.toLowerCase()) || 
    order.vendorName?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <SearchBar 
          value={search} 
          onChange={onSearch} 
          placeholder="Search orders..." 
          sx={{ width: 300 }}
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => onEdit({})}
          startIcon={<ReceiptIcon />}
        >
          New Order
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Date Issued</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.poNumber}</TableCell>
                <TableCell>{order.vendorName}</TableCell>
                <TableCell>{formatDateTime(order.dateIssued)}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>${order.totalAmount?.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onView(order.id)} size="small" color="info">
                    <ReceiptIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onEdit(order)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
}

PurchaseOrderTable.propTypes = {
  orders: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};