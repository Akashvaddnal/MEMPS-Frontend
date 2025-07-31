// // src/components/dashboard/MaintenanceRequestTable.jsx

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
// import dayjs from "dayjs";
// import { MAINTENANCE_REQUEST_ENDPOINTS } from "../../api/endpoints";

// const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Cancelled"];
// const MAINTENANCE_TYPE_OPTIONS = ["Preventive", "Corrective"];

// const MaintenanceRequestTable = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     equipmentId: "",
//     reportedBy: "",
//     technicianId: "",
//     issueDescription: "",
//     status: "Pending",
//     maintenanceType: "Preventive",
//     maintenanceNotes: "",
//     reportedAt: dayjs().format("YYYY-MM-DD"),
//     resolvedAt: "",
//   });

//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(MAINTENANCE_REQUEST_ENDPOINTS.GET_ALL);
//       setRequests(res.data || []);
//     } catch {
//       alert("Failed to fetch maintenance requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const openNewDialog = () => {
//     setFormData({
//       equipmentId: "",
//       reportedBy: "",
//       technicianId: "",
//       issueDescription: "",
//       status: "Pending",
//       maintenanceType: "Preventive",
//       maintenanceNotes: "",
//       reportedAt: dayjs().format("YYYY-MM-DD"),
//       resolvedAt: "",
//     });
//     setEditingId(null);
//     setDialogOpen(true);
//   };

//   const openEditDialog = (data) => {
//     setFormData({
//       equipmentId: data.equipmentId || "",
//       reportedBy: data.reportedBy || "",
//       technicianId: data.technicianId || "",
//       issueDescription: data.issueDescription || "",
//       status: data.status || "Pending",
//       maintenanceType: data.maintenanceType || "Preventive",
//       maintenanceNotes: data.maintenanceNotes || "",
//       reportedAt: data.reportedAt ? dayjs(data.reportedAt).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
//       resolvedAt: data.resolvedAt ? dayjs(data.resolvedAt).format("YYYY-MM-DD") : "",
//     });
//     setEditingId(data.id);
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
//       reportedAt: new Date(formData.reportedAt).toISOString(),
//       resolvedAt: formData.resolvedAt ? new Date(formData.resolvedAt).toISOString() : null,
//     };

//     try {
//       if (editingId) {
//         await axios.put(MAINTENANCE_REQUEST_ENDPOINTS.UPDATE(editingId), payload);
//         setRequests((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...payload } : r)));
//       } else {
//         const res = await axios.post(MAINTENANCE_REQUEST_ENDPOINTS.CREATE, payload);
//         setRequests((prev) => [...prev, res.data]);
//       }
//       closeDialog();
//     } catch {
//       alert("Failed to save maintenance request");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this maintenance request?")) return;

//     try {
//       await axios.delete(MAINTENANCE_REQUEST_ENDPOINTS.DELETE(id));
//       setRequests((prev) => prev.filter((r) => r.id !== id));
//     } catch {
//       alert("Failed to delete");
//     }
//   };

//   return (
//     <Box>
//       <Button variant="contained" sx={{ my: 2 }} onClick={openNewDialog}>
//         Add Maintenance Request
//       </Button>

//       {loading && <Typography>Loading...</Typography>}

//       <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
//         <Table stickyHeader size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Equipment ID</TableCell>
//               <TableCell>Reported By</TableCell>
//               <TableCell>Technician ID</TableCell>
//               <TableCell>Issue Description</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Maintenance Type</TableCell>
//               <TableCell>Maintenance Notes</TableCell>
//               <TableCell>Reported At</TableCell>
//               <TableCell>Resolved At</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {requests.length === 0 && !loading && (
//               <TableRow>
//                 <TableCell colSpan={10} align="center">
//                   No maintenance requests found
//                 </TableCell>
//               </TableRow>
//             )}
//             {requests
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((request) => (
//                 <TableRow key={request.id}>
//                   <TableCell>{request.equipmentId}</TableCell>
//                   <TableCell>{request.reportedBy}</TableCell>
//                   <TableCell>{request.technicianId || "-"}</TableCell>
//                   <TableCell>{request.issueDescription}</TableCell>
//                   <TableCell>{request.status}</TableCell>
//                   <TableCell>{request.maintenanceType}</TableCell>
//                   <TableCell>{request.maintenanceNotes || "-"}</TableCell>
//                   <TableCell>{dayjs(request.reportedAt).format("YYYY-MM-DD")}</TableCell>
//                   <TableCell>{request.resolvedAt ? dayjs(request.resolvedAt).format("YYYY-MM-DD") : "-"}</TableCell>
//                   <TableCell align="center">
//                     <Button size="small" onClick={() => openEditDialog(request)}>
//                       Edit
//                     </Button>
//                     <Button size="small" color="error" onClick={() => handleDelete(request.id)}>
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
//         count={requests.length}
//         rowsPerPageOptions={[5, 10, 25]}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
//         <DialogTitle>{editingId ? "Edit Maintenance Request" : "Add Maintenance Request"}</DialogTitle>
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
//             label="Reported By"
//             name="reportedBy"
//             fullWidth
//             margin="dense"
//             value={formData.reportedBy}
//             onChange={handleInputChange}
//             required
//           />
//           <TextField
//             label="Technician ID"
//             name="technicianId"
//             fullWidth
//             margin="dense"
//             value={formData.technicianId}
//             onChange={handleInputChange}
//           />
//           <TextField
//             label="Issue Description"
//             name="issueDescription"
//             fullWidth
//             margin="dense"
//             multiline
//             rows={3}
//             value={formData.issueDescription}
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
//             {STATUS_OPTIONS.map((status) => (
//               <MenuItem key={status} value={status}>
//                 {status}
//               </MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             select
//             label="Maintenance Type"
//             name="maintenanceType"
//             fullWidth
//             margin="dense"
//             value={formData.maintenanceType}
//             onChange={handleInputChange}
//             required
//           >
//             {MAINTENANCE_TYPE_OPTIONS.map((type) => (
//               <MenuItem key={type} value={type}>
//                 {type}
//               </MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             label="Maintenance Notes"
//             name="maintenanceNotes"
//             fullWidth
//             margin="dense"
//             multiline
//             rows={3}
//             value={formData.maintenanceNotes}
//             onChange={handleInputChange}
//           />
//           <TextField
//             label="Reported At"
//             name="reportedAt"
//             type="date"
//             fullWidth
//             margin="dense"
//             value={formData.reportedAt}
//             onChange={handleInputChange}
//             InputLabelProps={{ shrink: true }}
//             required
//           />
//           <TextField
//             label="Resolved At"
//             name="resolvedAt"
//             type="date"
//             fullWidth
//             margin="dense"
//             value={formData.resolvedAt}
//             onChange={handleInputChange}
//             InputLabelProps={{ shrink: true }}
//           />
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

// export default MaintenanceRequestTable;


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
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import axios from "axios";
// import dayjs from "dayjs";
// import { MAINTENANCE_REQUEST_ENDPOINTS, EQUIPMENT_ENDPOINTS } from "../../api/endpoints";

// // Constants
// const STATUS_OPTIONS_NEW = [{ label: "Pending", value: "Pending" }];
// const STATUS_OPTIONS_EDIT = [{ label: "Pending", value: "Pending" }, { label: "Cancelled", value: "Cancelled" }];
// const MAINTENANCE_TYPES = [
//   "Preventive",
//   "Corrective",
//   "Calibration",
//   "Inspection",
//   "Other",
// ];

// // Helper to get user name (adapt as needed)
// function getLoggedInUser() {
//   // Replace this with your actual authentication logic if needed:
//   // E.g., from Redux store, Context, or localStorage
//   return localStorage.getItem("username") || "Inventory manager";
// }

// // Main Component
// const MaintenanceRequestsTable = () => {
//   const [requests, setRequests] = useState([]);
//   const [equipmentList, setEquipmentList] = useState([]);
//   const [equipmentSearch, setEquipmentSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Table paging
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Dialog state
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   // Form
//   const [formData, setFormData] = useState({
//     equipmentId: "",
//     maintenanceType: "",
//     issueDescription: "",
//     status: "Pending",
//     reportedBy: getLoggedInUser(),
//     reportedAt: dayjs().format("YYYY-MM-DD"),
//   });

//   // Fetch list
//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(MAINTENANCE_REQUEST_ENDPOINTS.GET_ALL);
//       setRequests(res.data || []);
//     } catch {
//       alert("Failed to fetch maintenance requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch equipment for dropdown
//   const fetchEquipmentList = async () => {
//     try {
//       const res = await axios.get(EQUIPMENT_ENDPOINTS.GET_ALL);
//       setEquipmentList(res.data || []);
//     } catch {
//       setEquipmentList([]);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//     fetchEquipmentList();
//   }, []);

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // For add
//   const openNewDialog = () => {
//     setFormData({
//       equipmentId: "",
//       maintenanceType: "",
//       issueDescription: "",
//       status: "Pending",
//       reportedBy: getLoggedInUser(),
//       reportedAt: dayjs().format("YYYY-MM-DD"),
//     });
//     setEditingId(null);
//     setDialogOpen(true);
//   };

//   // For edit
//   const openEditDialog = (req) => {
//     setFormData({
//       equipmentId: req.equipmentId,
//       maintenanceType: req.maintenanceType,
//       issueDescription: req.issueDescription,
//       status: req.status,
//       reportedBy: req.reportedBy || getLoggedInUser(),
//       reportedAt: dayjs(req.reportedAt).format("YYYY-MM-DD"),
//     });
//     setEditingId(req.id);
//     setDialogOpen(true);
//   };

//   const closeDialog = () => setDialogOpen(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((fd) => ({ ...fd, [name]: value }));
//   };

//   // Only allow status "Pending" or "Cancelled" for editing
//   const getStatusOptions = () => editingId ? STATUS_OPTIONS_EDIT : STATUS_OPTIONS_NEW;

//   const handleSubmit = async () => {
//     // Construct payload
//     const payload = {
//       equipmentId: formData.equipmentId,
//       maintenanceType: formData.maintenanceType,
//       issueDescription: formData.issueDescription,
//       status: formData.status,
//       reportedBy: formData.reportedBy,
//       reportedAt: new Date(formData.reportedAt).toISOString(),
//     };

//     try {
//       if (editingId) {
//         await axios.put(MAINTENANCE_REQUEST_ENDPOINTS.UPDATE(editingId), payload);
//         setRequests((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...payload } : r)));
//       } else {
//         const res = await axios.post(MAINTENANCE_REQUEST_ENDPOINTS.CREATE, payload);
//         setRequests((prev) => [...prev, res.data]);
//       }
//       closeDialog();
//     } catch {
//       alert("Failed to save maintenance request");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this request?")) return;
//     try {
//       await axios.delete(MAINTENANCE_REQUEST_ENDPOINTS.DELETE(id));
//       setRequests((prev) => prev.filter((r) => r.id !== id));
//     } catch {
//       alert("Failed to delete request");
//     }
//   };

//   // Equipment search logic (simple filter, can be enhanced)
//   const filteredEquipment = equipmentList.filter(
//     (eq) =>
//       !equipmentSearch ||
//       (eq.equipmentId || eq.id || "")
//         .toLowerCase()
//         .includes(equipmentSearch.toLowerCase()) ||
//       (eq.name || "")
//         .toLowerCase()
//         .includes(equipmentSearch.toLowerCase())
//   );

//   return (
//     <Box>
//       <Button variant="contained" sx={{ my: 2 }} onClick={openNewDialog}>
//         Add Maintenance Request
//       </Button>
//       {loading && <Typography>Loading...</Typography>}

//       <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
//         <Table stickyHeader size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Equipment ID</TableCell>
//               <TableCell>Maintenance Type</TableCell>
//               <TableCell>Issue Description</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Reported By</TableCell>
//               <TableCell>Reported At</TableCell>
//               <TableCell align="center">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {requests.length === 0 && !loading && (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   No maintenance requests found
//                 </TableCell>
//               </TableRow>
//             )}
//             {requests
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((req) => (
//                 <TableRow key={req.id}>
//                   <TableCell>{req.equipmentId}</TableCell>
//                   <TableCell>{req.maintenanceType}</TableCell>
//                   <TableCell>{req.issueDescription}</TableCell>
//                   <TableCell>{req.status}</TableCell>
//                   <TableCell>{req.reportedBy}</TableCell>
//                   <TableCell>{dayjs(req.reportedAt).format("YYYY-MM-DD")}</TableCell>
//                   <TableCell align="center">
//                     <Button size="small" onClick={() => openEditDialog(req)}>
//                       Edit
//                     </Button>
//                     <Button size="small" color="error" onClick={() => handleDelete(req.id)}>
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
//         count={requests.length}
//         rowsPerPageOptions={[5, 10, 25]}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
//         <DialogTitle>{editingId ? "Edit Maintenance Request" : "Add Maintenance Request"}</DialogTitle>
//         <DialogContent dividers>
//           {/* Equipment Id Searchable Dropdown */}
//           <TextField
//             select
//             label="Equipment ID"
//             name="equipmentId"
//             fullWidth
//             margin="dense"
//             value={formData.equipmentId}
//             onChange={handleInputChange}
//             disabled={!!editingId}
//             required
//             SelectProps={{
//               native: false,
//               MenuProps: { style: { maxHeight: 250 } },
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <IconButton
//                     tabIndex={-1}
//                     size="small"
//                     sx={{ p: 0.5 }}
//                     onClick={() => setEquipmentSearch("")}
//                     disabled={!!editingId}
//                   >
//                     <SearchIcon />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//             helperText={
//               !editingId ? (
//                 <TextField
//                   placeholder="Search equipment..."
//                   value={equipmentSearch}
//                   onChange={(e) => setEquipmentSearch(e.target.value)}
//                   size="small"
//                   margin="dense"
//                   fullWidth
//                   disabled={!!editingId}
//                   variant="standard"
//                   InputProps={{ disableUnderline: true }}
//                 />
//               ) : null
//             }
//           >
//             {filteredEquipment.length === 0 && (
//               <MenuItem disabled>No matching equipment</MenuItem>
//             )}
//             {filteredEquipment.map((eq) => (
//               <MenuItem
//                 key={eq.equipmentId || eq.id}
//                 value={eq.equipmentId || eq.id}
//               >
//                 {(eq.equipmentId || eq.id) +
//                   (eq.name ? " — " + eq.name : "")}
//               </MenuItem>
//             ))}
//           </TextField>

//           {/* Maintenance Type */}
//           <TextField
//             select
//             label="Maintenance Type"
//             name="maintenanceType"
//             fullWidth
//             margin="dense"
//             value={formData.maintenanceType}
//             onChange={handleInputChange}
//             required
//             disabled={editingId ? false : false}
//           >
//             {MAINTENANCE_TYPES.map((type) => (
//               <MenuItem key={type} value={type}>
//                 {type}
//               </MenuItem>
//             ))}
//           </TextField>

//           {/* Issue Description */}
//           <TextField
//             label="Issue Description"
//             name="issueDescription"
//             fullWidth
//             margin="dense"
//             value={formData.issueDescription}
//             onChange={handleInputChange}
//             multiline
//             rows={3}
//             required
//             disabled={editingId ? false : false}
//           />

//           {/* Status */}
//           <TextField
//             select
//             label="Status"
//             name="status"
//             fullWidth
//             margin="dense"
//             value={formData.status}
//             onChange={handleInputChange}
//             required
//             disabled={editingId ? false : true} // editable in edit, but only pend/cancel
//           >
//             {getStatusOptions().map(({label, value}) => (
//               <MenuItem key={value} value={value}>{label}</MenuItem>
//             ))}
//           </TextField>

//           {/* Reported By */}
//           <TextField
//             label="Reported By"
//             name="reportedBy"
//             fullWidth
//             margin="dense"
//             value={formData.reportedBy}
//             disabled
//           />

//           {/* Reported At */}
//           <TextField
//             label="Reported At"
//             name="reportedAt"
//             type="date"
//             fullWidth
//             margin="dense"
//             value={formData.reportedAt}
//             disabled
//             InputLabelProps={{ shrink: true }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeDialog}>Cancel</Button>
//           <Button
//             onClick={handleSubmit}
//             variant="contained"
//             disabled={
//               !formData.equipmentId ||
//               !formData.maintenanceType ||
//               !formData.issueDescription
//             }
//           >
//             {editingId ? "Update" : "Create"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default MaintenanceRequestsTable;


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
import {
  MAINTENANCE_REQUEST_ENDPOINTS,
  EQUIPMENT_ENDPOINTS,
} from "../../api/endpoints";

// Status options
const STATUS_OPTIONS_NEW = [{ label: "Pending", value: "Pending" }];
const STATUS_OPTIONS_EDIT = [
  { label: "Pending", value: "Pending" },
  { label: "Cancelled", value: "Cancelled" },
];
const MAINTENANCE_TYPES = [
  "Preventive",
  "Corrective",
  "Calibration",
  "Inspection",
  "Other",
];

// Helper for username
function getLoggedInUser() {
  return localStorage.getItem("username") || "Inventory manager";
}
function getLoggedInUserDepartment(){
  return localStorage.getItem("username")|| "Inventory";
}

// Main component
const MaintenanceRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    equipmentId: "",
    maintenanceType: "",
    issueDescription: "",
    status: "Pending",
    reportedBy: getLoggedInUser(),
    department:getLoggedInUserDepartment(),
    reportedAt: dayjs().format("YYYY-MM-DD"),
    resolvedAt: null,
  });

  // Fetch list
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(MAINTENANCE_REQUEST_ENDPOINTS.GET_ALL);
      setRequests(res.data || []);
    } catch {
      alert("Failed to fetch maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch equipment for Autocomplete
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

  useEffect(() => {
    fetchRequests();
    fetchEquipmentList();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add
  const openNewDialog = () => {
    setFormData({
      equipmentId: "",
      maintenanceType: "",
      issueDescription: "",
      status: "Pending",
      reportedBy: getLoggedInUser(),
      department:getLoggedInUserDepartment(),
      reportedAt: dayjs().format("YYYY-MM-DD"),
      resolvedAt: null,
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  // Edit
  const openEditDialog = (req) => {
    setFormData({
      equipmentId: req.equipmentId,
      maintenanceType: req.maintenanceType,
      issueDescription: req.issueDescription,
      status: req.status,
      reportedBy: req.reportedBy || getLoggedInUser(),
      department: req.department||getLoggedInUserDepartment(),
      reportedAt: req.reportedAt
        ? dayjs(req.reportedAt).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      resolvedAt: req.resolvedAt
        ? dayjs(req.resolvedAt).format("YYYY-MM-DD")
        : null,
    });
    setEditingId(req.id);
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  // For status
  const getStatusOptions = () => (editingId ? STATUS_OPTIONS_EDIT : STATUS_OPTIONS_NEW);

  const handleSubmit = async () => {
    const payload = {
      equipmentId: formData.equipmentId,
      maintenanceType: formData.maintenanceType,
      issueDescription: formData.issueDescription,
      status: formData.status,
      reportedBy: formData.reportedBy,
      department:formData.department?formData.department:"default department",
      reportedAt: new Date(formData.reportedAt).toISOString(),
    };

    try {
      if (editingId) {
        await axios.put(MAINTENANCE_REQUEST_ENDPOINTS.UPDATE(editingId), payload);
        setRequests((prev) =>
          prev.map((r) => (r.id === editingId ? { ...r, ...payload } : r))
        );
      } else {
        const res = await axios.post(MAINTENANCE_REQUEST_ENDPOINTS.CREATE, payload);
        setRequests((prev) => [...prev, res.data]);
      }
      closeDialog();
    } catch {
      alert("Failed to save maintenance request");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(MAINTENANCE_REQUEST_ENDPOINTS.DELETE(id));
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete request");
    }
  };

  // Equipment Autocomplete Helpers
  function getEquipmentLabel(eq) {
    if (!eq) return "";
    return (
      (eq.equipmentId || eq.id || "") +
      (eq.name ? " — " + eq.name : "")
    );
  }
  // For Autocomplete controlled value
  const selectedEquipment =
    formData.equipmentId && equipmentList.length > 0
      ? equipmentList.find(
          (eq) =>
            eq.equipmentId === formData.equipmentId ||
            eq.id === formData.equipmentId
        ) || null
      : null;

  return (
    <Box>
      <Button variant="contained" sx={{ my: 2 }} onClick={openNewDialog}>
        Add Maintenance Request
      </Button>
      {loading && <Typography>Loading...</Typography>}

      <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Equipment ID</TableCell>
              <TableCell>Maintenance Type</TableCell>
              <TableCell>Issue Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Reported At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No maintenance requests found
                </TableCell>
              </TableRow>
            )}
            {requests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.equipmentId}</TableCell>
                  <TableCell>{req.maintenanceType}</TableCell>
                  <TableCell>{req.issueDescription}</TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>{req.reportedBy}</TableCell>
                  <TableCell>
                    {req.reportedAt
                      ? dayjs(req.reportedAt).format("YYYY-MM-DD")
                      : ""}
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => openEditDialog(req)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(req.id)}
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
        count={requests.length}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? "Edit Maintenance Request" : "Add Maintenance Request"}
        </DialogTitle>
        <DialogContent dividers>
          {/* Equipment Autocomplete */}
          <Autocomplete
            options={equipmentList}
            getOptionLabel={getEquipmentLabel}
            value={selectedEquipment}
            loading={equipmentLoading}
            disabled={!!editingId}
            onChange={(_, newValue) => {
              setFormData((fd) => ({
                ...fd,
                equipmentId:
                  newValue?.equipmentId || newValue?.id || "",
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="equipmentId"
                label="Equipment ID"
                margin="dense"
                fullWidth
                required
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
            isOptionEqualToValue={(option, value) =>
              (option.equipmentId || option.id) ===
              (value?.equipmentId || value?.id)
            }
          />

          {/* Maintenance Type */}
          <TextField
            select
            label="Maintenance Type"
            name="maintenanceType"
            fullWidth
            margin="dense"
            value={formData.maintenanceType}
            onChange={handleInputChange}
            required
            disabled={false}
          >
            {MAINTENANCE_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {/* Issue Description */}
          <TextField
            label="Issue Description"
            name="issueDescription"
            fullWidth
            margin="dense"
            value={formData.issueDescription}
            onChange={handleInputChange}
            multiline
            rows={3}
            required
            disabled={false}
          />

          {/* Status */}
          <TextField
            select
            label="Status"
            name="status"
            fullWidth
            margin="dense"
            value={formData.status}
            onChange={handleInputChange}
            required
            disabled={!editingId}
          >
            {getStatusOptions().map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>

          {/* Reported By */}
          <TextField
            label="Reported By"
            name="reportedBy"
            fullWidth
            margin="dense"
            value={formData.reportedBy}
            disabled
          />

          {/* Reported At */}
          <TextField
            label="Reported At"
            name="reportedAt"
            type="date"
            fullWidth
            margin="dense"
            value={formData.reportedAt}
            disabled
            InputLabelProps={{ shrink: true }}
          />

          {/* Resolved At (edit only, if exists) */}
          {editingId && formData.resolvedAt && (
            <TextField
              label="Resolved At"
              name="resolvedAt"
              type="date"
              fullWidth
              margin="dense"
              value={formData.resolvedAt}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.equipmentId ||
              !formData.maintenanceType ||
              !formData.issueDescription
            }
          >
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceRequestsTable;
