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
  TextField,
  Button,
} from '@mui/material';
import SearchBar from './SearchBar';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function AuditLogTable({ logs, search, onSearch }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filtered = logs.filter(log => {
    const matchesSearch =
      log.userId?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase());
    const logDate = dayjs(log.timestamp);
    const inRange =
      (!startDate || logDate.isAfter(startDate, 'minute') || logDate.isSame(startDate, 'minute')) &&
      (!endDate || logDate.isBefore(endDate, 'minute') || logDate.isSame(endDate, 'minute'));
    return matchesSearch && inRange;
  });

  useEffect(() => setPage(0), [search, startDate, endDate]);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <SearchBar value={search} onChange={onSearch} placeholder="Search by user ID or action..." />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Start Date & Time"
            value={startDate}
            onChange={setStartDate}
            renderInput={params => <TextField {...params} size="small" />}
          />
          <DateTimePicker
            label="End Date & Time"
            value={endDate}
            onChange={setEndDate}
            renderInput={params => <TextField {...params} size="small" />}
          />
        </LocalizationProvider>
      </Box>
      <TableContainer component={Paper} elevation={1}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Log ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.userId}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No audit logs found.
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
      {/* Placeholder for Generate Report button */}
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={() => alert('Generate report clicked')}>
          Generate Report
        </Button>
      </Box>
    </Box>
  );
}

AuditLogTable.propTypes = {
  logs: PropTypes.array.isRequired,
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};
