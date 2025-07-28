// // src/components/dashboard/StockLevelsTable.jsx

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   MenuItem,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";
// import axios from "axios";
// import { STOCK_LEVELS_ENDPOINTS } from "../../api/endpoints";

// const STATUS_OPTIONS = ["Normal", "Low", "Critical"];

// const StockLevelsTable = () => {
//   const [stocks, setStocks] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     equipmentId: "",
//     equipmentName: "",
//     currentStock: 0,
//     minRequired: 0,
//     lastChecked: "",
//     lastUpdated: "",
//     location: "",
//     status: "Normal",
//   });

//   const fetchStocks = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(STOCK_LEVELS_ENDPOINTS.GET_ALL);
//       setStocks(res.data || []);
//     } catch {
//       alert("Failed to fetch stock levels");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStocks();
//   }, []);

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const openNewDialog = () => {
//     const todayDate = new Date().toISOString().slice(0, 10);
//     setFormData({
//       equipmentId: "",
//       equipmentName: "",
//       currentStock: 0,
//       minRequired: 0,
//       lastChecked: todayDate,
//       lastUpdated: todayDate,
//       location: "",
//       status: "Normal",
//     });
//     setEditingId(null);
//     setDialogOpen(true);
//   };

//   const openEditDialog = (stock) => {
//     setFormData({
//       equipmentId: stock.equipmentId || "",
//       equipmentName: stock.equipmentName || "",
//       currentStock: stock.currentStock || 0,
//       minRequired: stock.minRequired || 0,
//       lastChecked: stock.lastChecked ? stock.lastChecked.slice(0, 10) : "",
//       lastUpdated: stock.lastUpdated ? stock.lastUpdated.slice(0, 10) : "",
//       location: stock.location || "",
//       status: stock.status || "Normal",
//     });
//     setEditingId(stock.id);
//     setDialogOpen(true);
//   };

//   const closeDialog = () => setDialogOpen(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((fd) => ({ ...fd, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     const payload = {
//       ...formData,
//       lastChecked: new Date(formData.lastChecked).toISOString(),
//       lastUpdated: new Date(formData.lastUpdated).toISOString(),
//     };

//     try {
//       if (editingId) {
//         await axios.put(STOCK_LEVELS_ENDPOINTS.UPDATE_STOCK(editingId), payload);
//         setStocks((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...payload } : s)));
//       } else {
//         const res = await axios.post(STOCK_LEVELS_ENDPOINTS.CREATE, payload);
//         setStocks((prev) => [...prev, res.data]);
//       }
//       closeDialog();
//     } catch {
//       alert("Failed to save stock level");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this stock level?")) return;

//     try {
//       await axios.delete(STOCK_LEVELS_ENDPOINTS.DELETE(id));
//       setStocks((prev) => prev.filter((s) => s.id !== id));
//     } catch {
//       alert("Failed to delete");
//     }
//   };

//   return (
//     <Box>
//       <Button variant="contained" sx={{ my: 2 }} onClick={openNewDialog}>
//         Add Stock Level
//       </Button>

//       {loading && <Typography>Loading...</Typography>}

//       <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
//         <Table stickyHeader size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Equipment ID</TableCell>
//               <TableCell>Equipment Name</TableCell>
//               <TableCell>Current Stock</TableCell>
//               <TableCell>Min Required</TableCell>
//               <TableCell>Last Checked</TableCell>
//               <TableCell>Last Updated</TableCell>
//               <TableCell>Location</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {stocks.length === 0 && !loading && (
//               <TableRow>
//                 <TableCell colSpan={9} align="center">
//                   No stock level data found
//                 </TableCell>
//               </TableRow>
//             )}
//             {stocks
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((stock) => (
//                 <TableRow key={stock.id}>
//                   <TableCell>{stock.equipmentId}</TableCell>
//                   <TableCell>{stock.equipmentName}</TableCell>
//                   <TableCell>{stock.currentStock}</TableCell>
//                   <TableCell>{stock.minRequired}</TableCell>
//                   <TableCell>{stock.lastChecked ? stock.lastChecked.slice(0, 10) : "-"}</TableCell>
//                   <TableCell>{stock.lastUpdated ? stock.lastUpdated.slice(0, 10) : "-"}</TableCell>
//                   <TableCell>{stock.location}</TableCell>
//                   <TableCell>{stock.status}</TableCell>
//                   <TableCell align="center">
//                     <Button size="small" onClick={() => openEditDialog(stock)}>
//                       Edit
//                     </Button>
//                     <Button size="small" color="error" onClick={() => handleDelete(stock.id)}>
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         component="div"
//         count={stocks.length}
//         rowsPerPageOptions={[5, 10, 25]}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
//         <DialogTitle>{editingId ? "Edit Stock Level" : "Add Stock Level"}</DialogTitle>
//         <DialogContent dividers>
//           <TextField
//             label="Equipment ID"
//             name="equipmentId"
//             fullWidth
//             margin="dense"
//             value={formData.equipmentId}
//             onChange={handleInputChange}
//             required
//           />
//           <TextField
//             label="Equipment Name"
//             name="equipmentName"
//             fullWidth
//             margin="dense"
//             value={formData.equipmentName}
//             onChange={handleInputChange}
//             required
//           />
//           <TextField
//             label="Current Stock"
//             name="currentStock"
//             type="number"
//             fullWidth
//             margin="dense"
//             value={formData.currentStock}
//             onChange={handleInputChange}
//             required
//           />
//           <TextField
//             label="Minimum Required"
//             name="minRequired"
//             type="number"
//             fullWidth
//             margin="dense"
//             value={formData.minRequired}
//             onChange={handleInputChange}
//             required
//           />
//           <TextField
//             label="Last Checked"
//             name="lastChecked"
//             type="date"
//             fullWidth
//             margin="dense"
//             value={formData.lastChecked}
//             onChange={handleInputChange}
//             InputLabelProps={{ shrink: true }}
//             required
//           />
//           <TextField
//             label="Last Updated"
//             name="lastUpdated"
//             type="date"
//             fullWidth
//             margin="dense"
//             value={formData.lastUpdated}
//             onChange={handleInputChange}
//             InputLabelProps={{ shrink: true }}
//             required
//           />
//           <TextField
//             label="Location"
//             name="location"
//             fullWidth
//             margin="dense"
//             value={formData.location}
//             onChange={handleInputChange}
//             required
//           />
//           <TextField
//             select
//             label="Status"
//             name="status"
//             fullWidth
//             margin="dense"
//             value={formData.status}
//             onChange={handleInputChange}
//             required
//           >
//             {STATUS_OPTIONS.map((s) => (
//               <MenuItem key={s} value={s}>
//                 {s}
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeDialog}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained">
//             {editingId ? "Update" : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default StockLevelsTable;


// // import React, { useEffect, useState } from "react";
// // import {
// //   Box,
// //   Button,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   MenuItem,
// //   Paper,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TablePagination,
// //   TableRow,
// //   TextField,
// //   Typography,
// //   CircularProgress,
// // } from "@mui/material";
// // import Autocomplete from "@mui/material/Autocomplete";
// // import axios from "axios";
// // import { STOCK_LEVELS_ENDPOINTS, EQUIPMENT_ENDPOINTS } from "../../api/endpoints";
// // import dayjs from "dayjs";

// // // Status constants
// // const STATUS_OPTIONS = ["Normal", "Low", "Critical"];

// // const StockLevelsTable = () => {
// //   const [stocks, setStocks] = useState([]);
// //   const [equipmentList, setEquipmentList] = useState([]);
// //   const [equipmentLoading, setEquipmentLoading] = useState(false);

// //   const [loading, setLoading] = useState(false);

// //   // Table paging
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(5);

// //   // Dialog state
// //   const [dialogOpen, setDialogOpen] = useState(false);
// //   const [editingId, setEditingId] = useState(null);

// //   // The currently selected equipment object, for name autofill
// //   const [selectedEquipment, setSelectedEquipment] = useState(null);

// //   const todayDateISO = new Date().toISOString().slice(0, 10);

// //   const [formData, setFormData] = useState({
// //     equipmentId: "",
// //     equipmentName: "",
// //     currentStock: 0,
// //     minRequired: 0,
// //     lastChecked: todayDateISO,
// //     lastUpdated: "",
// //     location: "",
// //     status: "Normal",
// //   });

// //   // GET EQUIPMENT for dropdown
// //   const fetchEquipmentList = async () => {
// //     setEquipmentLoading(true);
// //     try {
// //       const res = await axios.get(EQUIPMENT_ENDPOINTS.GET_ALL);
// //       setEquipmentList(Array.isArray(res.data) ? res.data : []);
// //     } catch {
// //       setEquipmentList([]);
// //     } finally {
// //       setEquipmentLoading(false);
// //     }
// //   };

// //   // GET stock data
// //   const fetchStocks = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await axios.get(STOCK_LEVELS_ENDPOINTS.GET_ALL);
// //       setStocks(res.data || []);
// //     } catch {
// //       alert("Failed to fetch stock levels");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchStocks();
// //     fetchEquipmentList();
// //   }, []);

// //   // Add new
// //   const openNewDialog = () => {
// //     setFormData({
// //       equipmentId: "",
// //       equipmentName: "",
// //       currentStock: 0,
// //       minRequired: 0,
// //       lastChecked: todayDateISO,
// //       // lastUpdated removed on add
// //       location: "",
// //       status: "Normal",
// //     });
// //     setSelectedEquipment(null);
// //     setEditingId(null);
// //     setDialogOpen(true);
// //   };

// //   // Edit
// //   const openEditDialog = (stock) => {
// //     // Find equipment for this stock for autofill (if available)
// //     const equipment =
// //       equipmentList.find((eq) =>
// //         (eq.id === stock.equipmentId) || (eq.equipmentId === stock.equipmentId))
// //       || null;
// //     setSelectedEquipment(equipment);

// //     setFormData({
// //       equipmentId: stock.equipmentId || "",
// //       equipmentName: stock.equipmentName || equipment?.name || "",
// //       currentStock: stock.currentStock ?? 0,
// //       minRequired: stock.minRequired ?? 0,
// //       lastChecked: stock.lastChecked ? stock.lastChecked.slice(0, 10) : todayDateISO,
// //       lastUpdated: stock.lastUpdated ? stock.lastUpdated.slice(0, 10) : todayDateISO,
// //       location: stock.location || "",
// //       status: stock.status || "Normal",
// //     });
// //     setEditingId(stock.id);
// //     setDialogOpen(true);
// //   };

// //   const closeDialog = () => setDialogOpen(false);

// //   // Handle field changes
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((fd) => ({ ...fd, [name]: value }));
// //   };

// //   // Autocomplete selection
// //   const handleEquipmentSelect = (event, equipObj) => {
// //     setSelectedEquipment(equipObj);
// //     setFormData((fd) => ({
// //       ...fd,
// //       equipmentId: equipObj ? equipObj.id : "",
// //       equipmentName: equipObj ? equipObj.name : "",
// //       // optionally also prefill location, or other info if required
// //     }));
// //   };

// //   // Disable logic
// //   const fieldsDisabled = !!editingId; // edit mode disables most fields
// //   // For edit, only enable currentStock, minRequired, location, status
// //   const editableFields = ["currentStock", "minRequired", "location", "status"];

// //   const handleSubmit = async () => {
// //     try {
// //       if (editingId) {
// //         // On Edit, set lastUpdated to now
// //         const updatedLastUpdated = new Date().toISOString();
// //         const payload = {
// //           ...formData,
// //           lastChecked: dayjs(formData.lastChecked).toISOString(),
// //           lastUpdated: updatedLastUpdated,
// //         };
// //         await axios.put(STOCK_LEVELS_ENDPOINTS.UPDATE_STOCK(editingId), payload);
// //         setStocks((prev) =>
// //           prev.map((s) => (s.id === editingId ? { ...s, ...payload } : s))
// //         );
// //       } else {
// //         // On Add, do NOT include lastUpdated (set by backend), and use only lastChecked (today)
// //         const payload = {
// //           equipmentId: formData.equipmentId,
// //           equipmentName: selectedEquipment?.name || "",
// //           currentStock: formData.currentStock,
// //           minRequired: formData.minRequired,
// //           lastChecked: dayjs(new Date()).toISOString(),
// //           location: formData.location,
// //           status: formData.status,
// //         };
// //         const res = await axios.post(STOCK_LEVELS_ENDPOINTS.CREATE, payload);
// //         setStocks((prev) => [...prev, res.data]);
// //       }
// //       closeDialog();
// //     } catch {
// //       alert("Failed to save stock level");
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Delete this stock level?")) return;
// //     try {
// //       await axios.delete(STOCK_LEVELS_ENDPOINTS.DELETE(id));
// //       setStocks((prev) => prev.filter((s) => s.id !== id));
// //     } catch {
// //       alert("Failed to delete");
// //     }
// //   };

// //   // Find equipment name given equipmentId, fallback if missing in state
// //   const disEquipmentName =
// //     (selectedEquipment && selectedEquipment.name) ||
// //     formData.equipmentName ||
// //     "";

// //     const handleChangePage = (event, newPage) => {
// //       setPage(newPage);
// //     };

// //   // Main JSX
// //   return (
// //     <Box>
// //       <Button variant="contained" sx={{ my: 2 }} onClick={openNewDialog}>
// //         Add Stock Level
// //       </Button>
// //       {loading && <Typography>Loading...</Typography>}

// //       <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
// //         <Table stickyHeader size="small">
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Equipment ID</TableCell>
// //               <TableCell>Equipment Name</TableCell>
// //               <TableCell>Current Stock</TableCell>
// //               <TableCell>Min Required</TableCell>
// //               <TableCell>Last Checked</TableCell>
// //               <TableCell>Last Updated</TableCell>
// //               <TableCell>Location</TableCell>
// //               <TableCell>Status</TableCell>
// //               <TableCell align="center">Actions</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {stocks.length === 0 && !loading && (
// //               <TableRow>
// //                 <TableCell colSpan={9} align="center">
// //                   No stock level data found
// //                 </TableCell>
// //               </TableRow>
// //             )}
// //             {stocks
// //               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
// //               .map((stock) => (
// //                 <TableRow key={stock.id}>
// //                   <TableCell>{stock.equipmentId}</TableCell>
// //                   <TableCell>{stock.equipmentName}</TableCell>
// //                   <TableCell>{stock.currentStock}</TableCell>
// //                   <TableCell>{stock.minRequired}</TableCell>
// //                   <TableCell>
// //                     {stock.lastChecked ? stock.lastChecked.slice(0, 10) : "-"}
// //                   </TableCell>
// //                   <TableCell>
// //                     {stock.lastUpdated ? stock.lastUpdated.slice(0, 10) : "-"}
// //                   </TableCell>
// //                   <TableCell>{stock.location}</TableCell>
// //                   <TableCell>{stock.status}</TableCell>
// //                   <TableCell align="center">
// //                     <Button size="small" onClick={() => openEditDialog(stock)}>
// //                       Edit
// //                     </Button>
// //                     <Button
// //                       size="small"
// //                       color="error"
// //                       onClick={() => handleDelete(stock.id)}
// //                     >
// //                       Delete
// //                     </Button>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       <TablePagination
// //         component="div"
// //         count={stocks.length}
// //         rowsPerPageOptions={[5, 10, 25]}
// //         rowsPerPage={rowsPerPage}
// //         page={page}
// //         onPageChange={handleChangePage}
// //         onRowsPerPageChange={handleChangeRowsPerPage}
// //       />

// //       <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
// //         <DialogTitle>
// //           {editingId ? "Edit Stock Level" : "Add Stock Level"}
// //         </DialogTitle>
// //         <DialogContent dividers>
// //           {/* Equipment Autocomplete */}
// //           <Autocomplete
// //             options={equipmentList}
// //             getOptionLabel={(eq) =>
// //               eq
// //                 ? (eq.id || "") +
// //                   (eq.name ? " - " + eq.name : "")
// //                 : ""
// //             }
// //             isOptionEqualToValue={(option, value) =>
// //               (option.id || "") === (value?.id || "")
// //             }
// //             value={
// //               equipmentList.find((eq) => eq.id === formData.equipmentId) ||
// //               null
// //             }
// //             onChange={(e, newValue) => handleEquipmentSelect(e, newValue)}
// //             disabled={fieldsDisabled}
// //             loading={equipmentLoading}
// //             renderInput={(params) => (
// //               <TextField
// //                 {...params}
// //                 label="Equipment ID"
// //                 margin="dense"
// //                 required
// //                 fullWidth
// //                 InputProps={{
// //                   ...params.InputProps,
// //                   endAdornment: (
// //                     <>
// //                       {equipmentLoading ? (
// //                         <CircularProgress color="inherit" size={18} />
// //                       ) : null}
// //                       {params.InputProps.endAdornment}
// //                     </>
// //                   ),
// //                 }}
// //               />
// //             )}
// //           />

// //           {/* Equipment Name (disabled, auto fill) */}
// //           <TextField
// //             label="Equipment Name"
// //             name="equipmentName"
// //             margin="dense"
// //             fullWidth
// //             value={disEquipmentName}
// //             disabled
// //           />

// //           {/* Current Stock */}
// //           <TextField
// //             label="Current Stock"
// //             name="currentStock"
// //             type="number"
// //             margin="dense"
// //             fullWidth
// //             value={formData.currentStock}
// //             onChange={handleInputChange}
// //             required
// //             disabled={fieldsDisabled && !editableFields.includes("currentStock")}
// //           />

// //           {/* Min Required */}
// //           <TextField
// //             label="Minimum Required"
// //             name="minRequired"
// //             type="number"
// //             margin="dense"
// //             fullWidth
// //             value={formData.minRequired}
// //             onChange={handleInputChange}
// //             required
// //             disabled={fieldsDisabled && !editableFields.includes("minRequired")}
// //           />

// //           {/* Last Checked (disabled, always set to today's date on add) */}
// //           <TextField
// //             label="Last Checked"
// //             name="lastChecked"
// //             type="date"
// //             margin="dense"
// //             fullWidth
// //             value={formData.lastChecked}
// //             InputLabelProps={{ shrink: true }}
// //             disabled
// //           />

// //           {/* Last Updated (Edit mode only, disabled, auto-set to now) */}
// //           {editingId && (
// //             <TextField
// //               label="Last Updated"
// //               name="lastUpdated"
// //               type="date"
// //               margin="dense"
// //               fullWidth
// //               value={formData.lastUpdated}
// //               InputLabelProps={{ shrink: true }}
// //               disabled
// //             />
// //           )}

// //           {/* Location */}
// //           <TextField
// //             label="Location"
// //             name="location"
// //             margin="dense"
// //             fullWidth
// //             value={formData.location}
// //             onChange={handleInputChange}
// //             required
// //             disabled={fieldsDisabled && !editableFields.includes("location")}
// //           />

// //           {/* Status */}
// //           <TextField
// //             select
// //             label="Status"
// //             name="status"
// //             margin="dense"
// //             fullWidth
// //             value={formData.status}
// //             onChange={handleInputChange}
// //             required
// //             disabled={fieldsDisabled && !editableFields.includes("status")}
// //           >
// //             {STATUS_OPTIONS.map((s) => (
// //               <MenuItem key={s} value={s}>
// //                 {s}
// //               </MenuItem>
// //             ))}
// //           </TextField>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={closeDialog}>Cancel</Button>
// //           <Button
// //             variant="contained"
// //             onClick={handleSubmit}
// //             disabled={
// //               // Disallow creating without required fields
// //               !formData.equipmentId ||
// //               formData.currentStock === "" ||
// //               formData.minRequired === "" ||
// //               !formData.location ||
// //               !formData.status
// //             }
// //           >
// //             {editingId ? "Update" : "Create"}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // };

// // export default StockLevelsTable;


import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import dayjs from "dayjs";
import { STOCK_LEVELS_ENDPOINTS, EQUIPMENT_ENDPOINTS } from "../../api/endpoints";

const STATUS_OPTIONS = ["Normal", "Low", "Critical"];

const StockLevelsTable = () => {
  const [stocks, setStocks] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Currently selected equipment to autofill name
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const todayDateISO = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    equipmentId: "",
    equipmentName: "",
    currentStock: 0,
    minRequired: 0,
    lastChecked: todayDateISO,
    lastUpdated: "",
    location: "",
    status: "Normal",
  });

  // Fetch equipment list from API
  const fetchEquipmentList = async () => {
    setEquipmentLoading(true);
    try {
      const res = await axios.get(EQUIPMENT_ENDPOINTS.GET_ALL);
      setEquipmentList(Array.isArray(res.data) ? res.data : []);
    } catch {
      setEquipmentList([]);
    } finally {
      setEquipmentLoading(false);
    }
  };

  // Fetch stock levels from API
  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(STOCK_LEVELS_ENDPOINTS.GET_ALL);
      setStocks(res.data || []);
    } catch {
      alert("Failed to fetch stock levels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchEquipmentList();
  }, []);

  // Open dialog for adding a new stock level
  const openNewDialog = () => {
    setFormData({
      equipmentId: "",
      equipmentName: "",
      currentStock: 0,
      minRequired: 0,
      lastChecked: todayDateISO,
      // lastUpdated removed on add
      location: "",
      status: "Normal",
    });
    setSelectedEquipment(null);
    setEditingId(null);
    setDialogOpen(true);
  };

  // Open dialog for editing an existing stock level
  const openEditDialog = (stock) => {
    // Find equipment info for autofill
    const equipment =
      equipmentList.find(
        (eq) => eq.id === stock.equipmentId || eq.equipmentId === stock.equipmentId
      ) || null;
    setSelectedEquipment(equipment);

    setFormData({
      equipmentId: stock.equipmentId || "",
      equipmentName: stock.equipmentName || equipment?.name || "",
      currentStock: stock.currentStock ?? 0,
      minRequired: stock.minRequired ?? 0,
      lastChecked: stock.lastChecked ? stock.lastChecked.slice(0, 10) : todayDateISO,
      lastUpdated: stock.lastUpdated ? stock.lastUpdated.slice(0, 10) : todayDateISO,
      location: stock.location || "",
      status: stock.status || "Normal",
    });
    setEditingId(stock.id);
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  // Handle basic text/number input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  // Handle selection from Equipment Autocomplete
  const handleEquipmentSelect = (event, equipObj) => {
    setSelectedEquipment(equipObj);
    setFormData((fd) => ({
      ...fd,
      equipmentId: equipObj ? equipObj.id : "",
      equipmentName: equipObj ? equipObj.name : "",
    }));
  };

  // Determine which fields are disabled
  const fieldsDisabled = !!editingId; // Editing disables equipment id and name
  // Editable fields on edit mode
  const editableFields = ["currentStock", "minRequired", "location", "status"];

  // Submit handler
  const handleSubmit = async () => {
    try {
      if (editingId) {
        // On Edit, lastUpdated set to current datetime
        const updatedLastUpdated = new Date().toISOString();
        const payload = {
          ...formData,
          lastChecked: dayjs(formData.lastChecked).toISOString(), // keep original lastChecked
          lastUpdated: updatedLastUpdated,
        };
        await axios.put(STOCK_LEVELS_ENDPOINTS.UPDATE(editingId), payload);
        setStocks((prev) =>
          prev.map((s) => (s.id === editingId ? { ...s, ...payload } : s))
        );
      } else {
        // On Add, do not send lastUpdated, use today's date for lastChecked
        const payload = {
          equipmentId: formData.equipmentId,
          equipmentName: selectedEquipment?.name || "",
          currentStock: formData.currentStock,
          minRequired: formData.minRequired,
          lastChecked: dayjs(new Date()).toISOString(),
          location: formData.location,
          status: formData.status,
        };
        const res = await axios.post(STOCK_LEVELS_ENDPOINTS.CREATE, payload);
        setStocks((prev) => [...prev, res.data]);
      }
      closeDialog();
    } catch(err) {
      console.error("Error saving stock level:", err);
      alert("Failed to save stock level");
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stock level?")) return;
    try {
      await axios.delete(STOCK_LEVELS_ENDPOINTS.DELETE(id));
      setStocks((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  // Equipment name to show (from selectedEquipment or formData)
  const displayedEquipmentName =
    (selectedEquipment && selectedEquipment.name) || formData.equipmentName || "";

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Button variant="contained" sx={{ my: 2 }} onClick={openNewDialog}>
        Add Stock Level
      </Button>
      {loading && <Typography>Loading...</Typography>}

      <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Equipment ID</TableCell>
              <TableCell>Equipment Name</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Min Required</TableCell>
              <TableCell>Last Checked</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No stock level data found
                </TableCell>
              </TableRow>
            )}
            {stocks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.equipmentId}</TableCell>
                  <TableCell>{stock.equipmentName}</TableCell>
                  <TableCell>{stock.currentStock}</TableCell>
                  <TableCell>{stock.minRequired}</TableCell>
                  <TableCell>
                    {stock.lastChecked ? stock.lastChecked.slice(0, 10) : "-"}
                  </TableCell>
                  <TableCell>
                    {stock.lastUpdated ? stock.lastUpdated.slice(0, 10) : "-"}
                  </TableCell>
                  <TableCell>{stock.location}</TableCell>
                  <TableCell>{stock.status}</TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => openEditDialog(stock)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(stock.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={stocks.length}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? "Edit Stock Level" : "Add Stock Level"}</DialogTitle>
        <DialogContent dividers>
          {/* Equipment Autocomplete */}
          <Autocomplete
            options={equipmentList}
            getOptionLabel={(eq) =>
              eq ? (eq.id || "") + (eq.name ? " - " + eq.name : "") : ""
            }
            isOptionEqualToValue={(option, value) =>
              (option.id || "") === (value?.id || "")
            }
            value={
              equipmentList.find((eq) => eq.id === formData.equipmentId) || null
            }
            onChange={handleEquipmentSelect}
            disabled={fieldsDisabled}
            loading={equipmentLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Equipment ID"
                margin="dense"
                required
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {equipmentLoading ? (
                        <CircularProgress color="inherit" size={18} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          {/* Equipment Name (auto-filled, disabled) */}
          <TextField
            label="Equipment Name"
            name="equipmentName"
            margin="dense"
            fullWidth
            value={displayedEquipmentName}
            disabled
          />

          {/* Current Stock */}
          <TextField
            label="Current Stock"
            name="currentStock"
            type="number"
            margin="dense"
            fullWidth
            value={formData.currentStock}
            onChange={handleInputChange}
            required
            disabled={fieldsDisabled && !editableFields.includes("currentStock")}
          />

          {/* Minimum Required */}
          <TextField
            label="Minimum Required"
            name="minRequired"
            type="number"
            margin="dense"
            fullWidth
            value={formData.minRequired}
            onChange={handleInputChange}
            required
            disabled={fieldsDisabled && !editableFields.includes("minRequired")}
          />

          {/* Last Checked (always disabled) */}
          <TextField
            label="Last Checked"
            name="lastChecked"
            type="date"
            margin="dense"
            fullWidth
            value={formData.lastChecked}
            InputLabelProps={{ shrink: true }}
            disabled
          />

          {/* Last Updated (only shown when editing) */}
          {editingId && (
            <TextField
              label="Last Updated"
              name="lastUpdated"
              type="date"
              margin="dense"
              fullWidth
              value={formData.lastUpdated}
              InputLabelProps={{ shrink: true }}
              disabled
            />
          )}

          {/* Location */}
          <TextField
            label="Location"
            name="location"
            margin="dense"
            fullWidth
            value={formData.location}
            onChange={handleInputChange}
            required
            disabled={fieldsDisabled && !editableFields.includes("location")}
          />

          {/* Status */}
          <TextField
            select
            label="Status"
            name="status"
            margin="dense"
            fullWidth
            value={formData.status}
            onChange={handleInputChange}
            required
            disabled={fieldsDisabled && !editableFields.includes("status")}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !formData.equipmentId ||
              formData.currentStock === "" ||
              formData.minRequired === "" ||
              !formData.location ||
              !formData.status
            }
          >
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockLevelsTable;
