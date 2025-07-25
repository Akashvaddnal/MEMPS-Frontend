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
  TextField,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchBar from './SearchBar';
import AddIcon from '@mui/icons-material/Add';

export default function UserTable({ users, onEdit, onDelete, search, onSearch, filters, onFilter }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = users.filter(
    u =>
      (u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.employeeId?.toString().toLowerCase().includes(search.toLowerCase()) ||
        u.department?.toLowerCase().includes(search.toLowerCase())) &&
      (filters.role ? u.roleName === filters.role : true) &&
      (filters.department ? u.department === filters.department : true)
  );

  useEffect(() => setPage(0), [search, filters]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={onSearch} placeholder="Search by name, ID, department..." />
        <TextField
          select
          label="Role"
          value={filters.role}
          onChange={e => onFilter({ ...filters, role: e.target.value })}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Clinician">Clinician</MenuItem>
        </TextField>
        <TextField
          select
          label="Department"
          value={filters.department}
          onChange={e => onFilter({ ...filters, department: e.target.value })}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="">All Departments</MenuItem>
          <MenuItem value="Cardiology">Cardiology</MenuItem>
          <MenuItem value="Radiology">Radiology</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', maxWidth: '100vw' }}>
        <Table size="small" sx={{ minWidth: 650, width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.roleName}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(user)} size="small" color="primary" aria-label="edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(user.id)} size="small" color="error" aria-label="delete">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No users found.
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

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
};
