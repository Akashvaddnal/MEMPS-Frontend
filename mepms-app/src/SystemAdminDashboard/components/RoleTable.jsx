import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchBar from './SearchBar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function RoleTable({ roles, onEdit, onDelete, search, onSearch }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = roles.filter(
    r => r.roleName?.toLowerCase().includes(search.toLowerCase()) || r.id?.toString().toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => setPage(0), [search]);


  return (
    <Box>
      <SearchBar value={search} onChange={onSearch} placeholder="Search by role name or ID..." />
      <TableContainer component={Paper} elevation={1}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(role => (
              <TableRow key={role.id}>
                <TableCell>{role.roleName}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(role)} size="small" color="primary" aria-label="edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(role.id)} size="small" color="error" aria-label="delete">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  No roles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.875rem' } }}
        />
      </TableContainer>
    </Box>
  );
}

RoleTable.propTypes = {
  roles: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};
