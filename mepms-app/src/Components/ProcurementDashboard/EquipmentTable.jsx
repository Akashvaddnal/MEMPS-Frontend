// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Paper,
//   IconButton,
//   TextField,
//   MenuItem,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SearchBar from '../common/SearchBar';

// export default function EquipmentTable({ 
//   equipment, 
//   onEdit, 
//   onDelete, 
//   search, 
//   onSearch,
//   filters,
//   onFilter 
// }) {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const filtered = equipment.filter(eq => 
//     eq.name?.toLowerCase().includes(search.toLowerCase()) || 
//     eq.serialNumber?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
//         <SearchBar value={search} onChange={onSearch} placeholder="Search equipment..." />
//         <TextField
//           select
//           label="Category"
//           value={filters.category}
//           onChange={e => onFilter({ ...filters, category: e.target.value })}
//           size="small"
//           sx={{ width: 150 }}
//         >
//           <MenuItem value="">All Categories</MenuItem>
//           <MenuItem value="Diagnostic">Diagnostic</MenuItem>
//           <MenuItem value="Therapeutic">Therapeutic</MenuItem>
//         </TextField>
//         <TextField
//           select
//           label="Status"
//           value={filters.status}
//           onChange={e => onFilter({ ...filters, status: e.target.value })}
//           size="small"
//           sx={{ width: 150 }}
//         >
//           <MenuItem value="">All Status</MenuItem>
//           <MenuItem value="Functional">Functional</MenuItem>
//           <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
//         </TextField>
//       </Box>
//       <TableContainer component={Paper}>
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Model</TableCell>
//               <TableCell>Serial Number</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Location</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
//               <TableRow key={item.id}>
//                 <TableCell>{item.name}</TableCell>
//                 <TableCell>{item.model}</TableCell>
//                 <TableCell>{item.serialNumber}</TableCell>
//                 <TableCell>{item.category}</TableCell>
//                 <TableCell>{item.status}</TableCell>
//                 <TableCell>{item.location}</TableCell>
//                 <TableCell align="center">
//                   <IconButton onClick={() => onEdit(item)} size="small">
//                     <EditIcon fontSize="small" />
//                   </IconButton>
//                   <IconButton onClick={() => onDelete(item.id)} size="small" color="error">
//                     <DeleteIcon fontSize="small" />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={filtered.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={(e, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </TableContainer>
//     </Box>
//   );
// }

// EquipmentTable.propTypes = {
//   equipment: PropTypes.array.isRequired,
//   onEdit: PropTypes.func.isRequired,
//   onDelete: PropTypes.func.isRequired,
//   search: PropTypes.string.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   filters: PropTypes.object.isRequired,
//   onFilter: PropTypes.func.isRequired,
// };


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
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchBar from '../common/SearchBar';

export default function EquipmentTable({ 
  equipment, 
  onEdit, 
  onDelete, 
  search, 
  onSearch,
  filters,
  onFilter 
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = equipment.filter(eq => {
    const matchesSearch = 
      eq.name?.toLowerCase().includes(search.toLowerCase()) || 
      eq.serialNumber?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = 
      !filters.category || eq.category === filters.category;
    
    const matchesStatus = 
      !filters.status || eq.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Functional': return 'success';
      case 'Under Maintenance': return 'warning';
      case 'Out of Service': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={onSearch} placeholder="Search equipment..." />
        <TextField
          select
          label="Category"
          value={filters.category}
          onChange={e => onFilter({ ...filters, category: e.target.value })}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="Diagnostic">Diagnostic</MenuItem>
          <MenuItem value="Therapeutic">Therapeutic</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          value={filters.status}
          onChange={e => onFilter({ ...filters, status: e.target.value })}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="Functional">Functional</MenuItem>
          <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
          <MenuItem value="Out of Service">Out of Service</MenuItem>
        </TextField>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.serialNumber}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    size="small" 
                    color={getStatusColor(item.status)}
                  />
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(item)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => onDelete(item.id)} 
                    size="small" 
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
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

EquipmentTable.propTypes = {
  equipment: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
};