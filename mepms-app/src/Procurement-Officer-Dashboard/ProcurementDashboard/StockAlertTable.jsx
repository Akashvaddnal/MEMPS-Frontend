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
//   Chip,
//   Button,
// } from '@mui/material';
// import WarningIcon from '@mui/icons-material/Warning';
// import SearchBar from '../common/SearchBar';

// export default function StockAlertTable({ 
//   alerts, 
//   onReorder, 
//   search, 
//   onSearch 
// }) {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const filtered = alerts.filter(alert => 
//     alert.equipmentName?.toLowerCase().includes(search.toLowerCase()) || 
//     alert.equipmentId?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Box>
//       <SearchBar 
//         value={search} 
//         onChange={onSearch} 
//         placeholder="Search alerts..." 
//         sx={{ mb: 2, width: 300 }}
//       />
//       <TableContainer component={Paper}>
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Equipment</TableCell>
//               <TableCell>Current Stock</TableCell>
//               <TableCell>Minimum Required</TableCell>
//               <TableCell>Last Checked</TableCell>
//               <TableCell align="center">Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(alert => (
//               <TableRow key={alert.id}>
//                 <TableCell>
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <WarningIcon color="error" sx={{ mr: 1 }} />
//                     {alert.equipmentName}
//                   </Box>
//                 </TableCell>
//                 <TableCell>{alert.currentQuantity}</TableCell>
//                 <TableCell>{alert.minRequired}</TableCell>
//                 <TableCell>{new Date(alert.lastChecked).toLocaleDateString()}</TableCell>
//                 <TableCell align="center">
//                   <Button 
//                     variant="outlined" 
//                     size="small"
//                     onClick={() => onReorder(alert.equipmentId)}
//                   >
//                     Reorder
//                   </Button>
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

// StockAlertTable.propTypes = {
//   alerts: PropTypes.array.isRequired,
//   onReorder: PropTypes.func.isRequired,
//   search: PropTypes.string.isRequired,
//   onSearch: PropTypes.func.isRequired,
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
  Chip,
  Button,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import SearchBar from '../common/SearchBar';

export default function StockAlertTable({ 
  alerts, 
  onReorder, 
  search, 
  onSearch 
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = alerts.filter(alert => 
    alert.equipmentName?.toLowerCase().includes(search.toLowerCase()) || 
    alert.equipmentId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <SearchBar 
        value={search} 
        onChange={onSearch} 
        placeholder="Search alerts..." 
        sx={{ mb: 2, width: 300 }}
      />
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Equipment</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Minimum Required</TableCell>
              <TableCell>Last Checked</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(alert => (
              <TableRow key={alert.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WarningIcon color="error" sx={{ mr: 1 }} />
                    {alert.equipmentName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={alert.currentQuantity} 
                    color={alert.currentQuantity < alert.minRequired ? 'error' : 'success'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{alert.minRequired}</TableCell>
                <TableCell>{new Date(alert.lastChecked).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => onReorder(alert.equipmentId)}
                    color="warning"
                  >
                    Reorder
                  </Button>
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

StockAlertTable.propTypes = {
  alerts: PropTypes.array.isRequired,
  onReorder: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};