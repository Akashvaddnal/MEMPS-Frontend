// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Typography,
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CircularProgress,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogActions,
//   DialogTitle,
//   TextField,
//   Chip,
//   Stack,
//   Card,
//   MenuItem,
//   Pagination,
//   useTheme,
// } from "@mui/material";
// import {
//   AssignmentLate as PendingIcon,
//   CheckCircleOutline as AcceptedIcon,
//   HourglassTop as InProgressIcon,
//   TaskAlt as ResolvedIcon,
// } from '@mui/icons-material';
// import axios from "axios";
// import { biomedicalEndpoints } from "../../api/biomedicalEndpoints"; // adjust path as needed
// import dayjs from "dayjs";

// // Status options for edit mode
// const STATUS_OPTIONS_EDIT = [
//   { label: "In Progress", value: "In Progress" },
//   { label: "Resolved", value: "Resolved" },
// ];

// // Status for new requests - not used since we removed new request creation
// const STATUS_OPTIONS_NEW = [
//   { label: "Pending", value: "Pending" },
// ];

// // Map status to icon + color for stats cards
// const statusMeta = {
//   Pending: { icon: <PendingIcon fontSize="large" />, color: "warning.main" },
//   Accepted: { icon: <AcceptedIcon fontSize="large" />, color: "info.main" },
//   "In Progress": { icon: <InProgressIcon fontSize="large" />, color: "primary.main" },
//   Resolved: { icon: <ResolvedIcon fontSize="large" />, color: "success.main" },
// };

// // Stats Card component with icon
// function StatsCard({ label, value }) {
//   const { icon, color } = statusMeta[label] || {};
//   return (
//     <Card
//       raised
//       sx={{
//         p: 2,
//         m: 1,
//         minWidth: 180,
//         display: "flex",
//         alignItems: "center",
//         gap: 2,
//         boxShadow: 3,
//         borderRadius: 3,
//         transition: "transform 0.3s ease",
//         cursor: "default",
//         "&:hover": {
//           transform: "scale(1.05)",
//           boxShadow: 9,
//         },
//       }}
//     >
//       <Box
//         sx={{
//           bgcolor: color,
//           borderRadius: "50%",
//           width: 56,
//           height: 56,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "white",
//         }}
//       >
//         {icon}
//       </Box>
//       <Box>
//         <Typography variant="subtitle2" color="textSecondary">
//           {label}
//         </Typography>
//         <Typography variant="h4" fontWeight="bold" color={color}>
//           {value}
//         </Typography>
//       </Box>
//     </Card>
//   );
// }

// export default function MaintenanceRequests({ currentUser }) {
//   const theme = useTheme();

//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [equipmentOptions, setEquipmentOptions] = useState([]);

//   const [openEdit, setOpenEdit] = useState(false);
//   const [editForm, setEditForm] = useState(null);

//   const [stats, setStats] = useState({
//     pending: 0,
//     accepted: 0,
//     inProgress: 0,
//     resolved: 0,
//   });

//   // Pagination states
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   // Fetch all equipment once
//   const fetchAllEquipments = async () => {
//     try {
//       const res = await axios.get(biomedicalEndpoints.equipment.getAll);
//       return res.data || [];
//     } catch {
//       return [];
//     }
//   };

//   // Load maintenance requests filtered for this user + stats
//   const loadRequests = useCallback(async () => {
//     if (!currentUser || !currentUser.employeeId) return;

//     setLoading(true);
//     try {
//       const res = await axios.get(biomedicalEndpoints.maintenance.getAll);
//       const allRequests = res.data || [];

//       // Filter requests:
//       // Show all unaccepted requests + accepted assigned to current user
//       const filtered = allRequests.filter((req) => {
//         const accepted = req.accepted ?? false;
//         if (!accepted) return true;
//         return String(req.technicianId) === String(currentUser.employeeId);
//       });

//       setRequests(filtered);

//       // Stats calculation on all requests
//       const assignedRequests = allRequests.filter(
//         (req) => String(req.technicianId) === String(currentUser.employeeId)
//       );

//       const pendingCount = allRequests.filter((req) => !req.accepted).length;
//       const acceptedCount = assignedRequests.filter((req) => req.status !== "Resolved").length;
//       const inProgressCount = assignedRequests.filter((req) => req.status === "In Progress").length;
//       const resolvedCount = assignedRequests.filter((req) => req.status === "Resolved").length;

//       setStats({
//         pending: pendingCount,
//         accepted: acceptedCount,
//         inProgress: inProgressCount,
//         resolved: resolvedCount,
//       });

//     } catch (error) {
//       console.error("Failed to load maintenance requests:", error);
//       setRequests([]);
//       setStats({ pending: 0, accepted: 0, inProgress: 0, resolved: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }, [currentUser]);

//   // Load equipment options once
//   const loadEquipments = useCallback(async () => {
//     const equipment = await fetchAllEquipments();
//     setEquipmentOptions(equipment);
//   }, []);

//   useEffect(() => {
//     loadRequests();
//     loadEquipments();
//   }, [loadRequests, loadEquipments]);

//   // Pagination handlers
//   const handlePageChange = (event, value) => {
//     setPage(value);
//   };

//   // Open edit dialog with selected request
//   const openEditDialog = (req) => {
//     const eqObj = equipmentOptions.find(
//       (eq) => eq.id === req.equipmentId || eq._id === req.equipmentId
//     ) || null;
//     setEditForm({ ...req, equipmentObj: eqObj });
//     setOpenEdit(true);
//   };

//   const closeEdit = () => {
//     setEditForm(null);
//     setOpenEdit(false);
//   };

//   const handleEditFormChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const getStatusOptions = () => (editForm?.accepted ? STATUS_OPTIONS_EDIT : STATUS_OPTIONS_NEW);

//   // Update edited request
//   const submitEditRequest = async () => {
//     if (!editForm) return;

//     let payload = { ...editForm };

//     // Set resolvedAt date when status changed to Resolved
//     if (payload.status === "Resolved" && (!payload.resolvedAt || payload.resolvedAt === null)) {
//       payload.resolvedAt = new Date().toISOString();
//     }

//     try {
//       await axios.put(`${biomedicalEndpoints.maintenance.getAll}/${payload.id}`, {
//         ...payload,
//         technicianId: currentUser.employeeId,
//         accepted: true,
//       });
//       alert("Request updated successfully.");
//       closeEdit();
//       loadRequests();
//     } catch {
//       alert("Failed to update request.");
//     }
//   };

//   // Accept a maintenance request and assign it to current user
//   const acceptRequest = async (req) => {
//     try {
//       const payload = {
//         ...req,
//         technicianId: currentUser.employeeId,
//         accepted: true,
//         status: "In Progress",
//       };
//       await axios.put(`${biomedicalEndpoints.maintenance.getAll}/${req.id || req._id}`, payload);
//       alert("Request accepted successfully.");
//       loadRequests();
//     } catch {
//       alert("Failed to accept request.");
//     }
//   };

//   // Data slicing for pagination
//   const startIdx = (page - 1) * rowsPerPage;
//   const pagedRequests = requests.slice(startIdx, startIdx + rowsPerPage);
//   const totalPages = Math.ceil(requests.length / rowsPerPage);

//   return !currentUser || !currentUser.employeeId ? (
//     <Box sx={{ mt: 4, textAlign: "center" }}>
//       <Typography>
//         {currentUser ? `Employee ID: ${currentUser.employeeId}` : "Loading user info..."}
//       </Typography>
//     </Box>
//   ) : (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Maintenance Requests
//       </Typography>

//       {/* Stats Cards */}
//       <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
//         <StatsCard label="Pending" value={stats.pending} />
//         <StatsCard label="Accepted" value={stats.accepted} />
//         <StatsCard label="In Progress" value={stats.inProgress} />
//         <StatsCard label="Resolved" value={stats.resolved} />
//       </Stack>

//       {/* Table */}
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <Paper>
//           <TableContainer sx={{ maxHeight: 500 }}>
//             <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
//               <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
//                 <TableRow>
//                   <TableCell><b>Equipment Name</b></TableCell>
//                   <TableCell><b>Issue</b></TableCell>
//                   <TableCell><b>Reported By</b></TableCell>
//                   <TableCell><b>Status</b></TableCell>
//                   <TableCell><b>Type</b></TableCell>
//                   <TableCell><b>Reported At</b></TableCell>
//                   <TableCell><b>Accepted</b></TableCell>
//                   <TableCell><b>Department</b></TableCell>
//                   <TableCell width={130}><b>Actions</b></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {pagedRequests.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={9} align="center">
//                       No maintenance requests found.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   pagedRequests.map((req) => (
//                     <TableRow hover key={req.id || req._id}>
//                       <TableCell>
//                         {equipmentOptions.find(eq => eq.id === req.equipmentId || eq._id === req.equipmentId)?.name || req.equipmentId || "-"}
//                       </TableCell>
//                       <TableCell>{req.issueDescription || "-"}</TableCell>
//                       <TableCell>{req.reportedBy || "-"}</TableCell>
//                       <TableCell>
//                         <Chip
//                           label={req.status || "-"}
//                           color={
//                             req.status === "Resolved"
//                               ? "success"
//                               : req.status === "In Progress"
//                               ? "primary"
//                               : "warning"
//                           }
//                           size="small"
//                           variant={req.status === "Resolved" ? "filled" : "outlined"}
//                         />
//                       </TableCell>
//                       <TableCell>{req.maintenanceType || "-"}</TableCell>
//                       <TableCell>{req.reportedAt ? dayjs(req.reportedAt).format("DD-MM-YYYY HH:mm") : "-"}</TableCell>
//                       <TableCell>{req.accepted ? "Yes" : "No"}</TableCell>
//                       <TableCell>{req.department || "-"}</TableCell>
//                       <TableCell>
//                         {!req.accepted ? (
//                           <Button
//                             color="primary"
//                             size="small"
//                             variant="outlined"
//                             onClick={() => acceptRequest(req)}
//                           >
//                             Accept
//                           </Button>
//                         ) : (
//                           <Button
//                             size="small"
//                             variant="outlined"
//                             onClick={() => openEditDialog(req)}
//                           >
//                             View / Edit
//                           </Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           {requests.length > rowsPerPage && (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 p: 2,
//                 backgroundColor: theme.palette.grey[50],
//               }}
//             >
//               <Pagination
//                 count={totalPages}
//                 page={page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 shape="rounded"
//                 showFirstButton
//                 showLastButton
//               />
//             </Box>
//           )}
//         </Paper>
//       )}

//       {/* Edit Request Dialog */}
//       <Dialog open={openEdit} onClose={closeEdit} maxWidth="sm" fullWidth>
//         <DialogTitle>Modify Maintenance Request</DialogTitle>
//         {editForm ? (
//           <DialogContent>
//             <TextField
//               label="Equipment Name"
//               value={
//                 equipmentOptions.find(eq => eq.id === editForm.equipmentId || eq._id === editForm.equipmentId)?.name ||
//                 editForm.equipmentId ||
//                 "-"
//               }
//               disabled
//               fullWidth
//               margin="dense"
//             />
//             <TextField
//               label="Department"
//               value={editForm.department || editForm.departmentName || "-"}
//               disabled
//               fullWidth
//               margin="dense"
//             />
//             <TextField
//               label="Reported By"
//               value={editForm.reportedBy || "-"}
//               disabled
//               fullWidth
//               margin="dense"
//             />
//             <TextField
//               label="Issue Description"
//               value={editForm.issueDescription || "-"}
//               multiline
//               rows={3}
//               disabled
//               fullWidth
//               margin="dense"
//             />
//             <TextField
//               label="Maintenance Type"
//               value={editForm.maintenanceType || "-"}
//               disabled
//               fullWidth
//               margin="dense"
//             />
//             <TextField
//               label="Status"
//               name="status"
//               value={editForm.status || "-"}
//               onChange={handleEditFormChange}
//               select
//               fullWidth
//               margin="dense"
//               disabled={editForm.status === "Resolved" || !editForm.accepted}
//             >
//               {getStatusOptions().map(({ label, value }) => (
//                 <MenuItem key={value} value={value}>
//                   {label}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               label="Reported At"
//               value={editForm.reportedAt ? dayjs(editForm.reportedAt).format("DD-MM-YYYY HH:mm") : "-"}
//               disabled
//               fullWidth
//               margin="dense"
//             />
//             <TextField
//               label="Resolved At"
//               value={editForm.resolvedAt ? dayjs(editForm.resolvedAt).format("DD-MM-YYYY HH:mm") : "-"}
//               disabled
//               fullWidth
//               margin="dense"
//             />
//             <TextField
//               label="Maintenance Notes"
//               name="maintenanceNotes"
//               value={editForm.maintenanceNotes || ""}
//               onChange={handleEditFormChange}
//               multiline
//               rows={3}
//               fullWidth
//               margin="dense"
//               disabled={!editForm.accepted || editForm.status === "Resolved"}
//             />
//           </DialogContent>
//         ) : (
//           <DialogContent>
//             <Typography>Loading...</Typography>
//           </DialogContent>
//         )}
//         <DialogActions>
//           <Button onClick={closeEdit}>Cancel</Button>
//           <Button
//             onClick={submitEditRequest}
//             variant="contained"
//             disabled={!editForm?.accepted || editForm?.resolvedAt!== null}
//           >
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }


import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Chip,
  Stack,
  Card,
  MenuItem,
  Pagination,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  AssignmentLate as PendingIcon,
  CheckCircleOutline as AcceptedIcon,
  HourglassTop as InProgressIcon,
  TaskAlt as ResolvedIcon,
} from '@mui/icons-material';
import axios from "axios";
import { biomedicalEndpoints } from "../../api/biomedicalEndpoints"; // adjust path as needed
import dayjs from "dayjs";

// Status options for editing maintenance requests
const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Accepted", value: "Accepted" },
  { label: "In Progress", value: "In Progress" },
  { label: "Resolved", value: "Resolved" },
];

// Maintenance type filters (assuming 'type' field exists on requests)
const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Mechanical", value: "Mechanical" },
  { label: "Electrical", value: "Electrical" },
  { label: "Software", value: "Software" },
  // add more types as per your application
];

// Map status to icon and color
const statusMeta = {
  Pending: { icon: <PendingIcon fontSize="large" />, color: "warning.main" },
  Accepted: { icon: <AcceptedIcon fontSize="large" />, color: "info.main" },
  "In Progress": { icon: <InProgressIcon fontSize="large" />, color: "primary.main" },
  Resolved: { icon: <ResolvedIcon fontSize="large" />, color: "success.main" },
};

// Stats card component
function StatsCard({ label, value }) {
  const theme = useTheme();
  const meta = statusMeta[label] || {};
  return (
    <Card
      raised
      sx={{
        p: 2,
        m: 1,
        minWidth: 180,
        display: "flex",
        alignItems: "center",
        gap: 2,
        boxShadow: 4,
        cursor: "default",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          bgcolor: meta.color,
          borderRadius: "50%",
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {meta.icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" color={meta.color}>
          {value}
        </Typography>
      </Box>
    </Card>
  );
}

export default function MaintenanceRequests({ currentUser }) {
  const theme = useTheme();

  // State declarations
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [stats, setStats] = useState({
    Pending: 0,
    Accepted: 0,
    "In Progress": 0,
    Resolved: 0,
  });

  // Filters and pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Search and filters
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editRequest, setEditRequest] = useState(null);

  // Snackbar for alerts
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Snackbar handlers
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch all equipment once
  const fetchAllEquipment = async () => {
    try {
      const res = await axios.get(biomedicalEndpoints.equipment.getAll);
      return res.data || [];
    } catch {
      return [];
    }
  };

  // Fetch requests and compute stats
  const fetchRequests = useCallback(async () => {
    if (!currentUser || !currentUser.employeeId) return;
    setLoading(true);
    try {
      const [reqRes, equipRes] = await Promise.all([
        axios.get(biomedicalEndpoints.maintenance.getAll),
        fetchAllEquipment(),
      ]);
      const allRequests = reqRes.data || [];
      setEquipmentList(equipRes);

      // Filter requests to show all non-assigned, or assigned to current user
      const filtered = allRequests.filter(r => {
        if (!r.accepted) return true;  // show unassigned
        return String(r.technicianId) === String(currentUser.employeeId);
      });

      setRequests(filtered);

      // Calculate stats for current user
      const assigned = allRequests.filter(r => String(r.technicianId) === String(currentUser.employeeId));

      const statsData = {
        Pending: allRequests.filter(r => !r.accepted).length,
        Accepted: assigned.filter(r => r.status !== "Resolved").length,
        "In Progress": assigned.filter(r => r.status === "In Progress").length,
        Resolved: assigned.filter(r => r.status === "Resolved").length,
      };
      setStats(statsData);

    } catch (err) {
      console.error("Failed to load maintenance requests:", err);
      setRequests([]);
      setStats({ Pending: 0, Accepted: 0, "In Progress": 0, Resolved: 0 });
      showSnackbar("Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Pagination handlers
  const handlePageChange = (e, p) => setPage(p);

  // Search and filter handlers
  const handleSearchChange = e => {
    setSearchText(e.target.value);
    setPage(1);
  };
  const handleStatusFilterChange = e => {
    setStatusFilter(e.target.value);
    setPage(1);
  };
  const handleTypeFilterChange = e => {
    setTypeFilter(e.target.value);
    setPage(1);
  };

  // Open edit dialog
  const openEditDialog = (request) => {
    setEditRequest({ ...request });
    setEditOpen(true);
  };
  const closeEditDialog = () => {
    setEditOpen(false);
    setEditRequest(null);
  };

  // Edit form change handler
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRequest(prev => ({ ...prev, [name]: value }));
  };

  // Submit edited request, and update Equipment Lifecycle accordingly
  const submitEditRequest = async () => {
    if (!editRequest) return;

    let payload = { ...editRequest };

    // If status changed to Resolved and resolvedAt is missing, set resolvedAt
    if (payload.status === "Resolved" && !payload.resolvedAt) {
      payload.resolvedAt = new Date().toISOString();
    }

    try {
      // Update Maintenance Request
      await axios.put(`${biomedicalEndpoints.maintenance.update(payload.id)}`, {
        ...payload,
      });

      // Update corresponding Equipment Lifecycle record
      // Find lifecycle record by equipmentId
      const lifecycle = await axios.get(`${biomedicalEndpoints.lifecycle.getByEquipmentId(payload.equipmentId)}`);
      if (lifecycle && lifecycle.data) {
        const lc = lifecycle.data[0];

        let lcUpdate = {};

        if (payload.status === "In Progress") {
          // Update lifecycle to Under Maintenance
          lcUpdate = {
            ...lc,
            status: "Under Maintenance",
            mainteneceDoneBy: currentUser.employeeId,
          };
        } else if (payload.status === "Resolved") {
          // Update lifecycle: lastMaintenanceDate = resolvedAt, nextMaintenanceDate = last + 3 months, status reset
          const resolvedDate = payload.resolvedAt ? new Date(payload.resolvedAt) : new Date();
          lcUpdate = {
            ...lc,
            maintenanceCount: lc.maintenanceCount+1,
            lastMaintenanceDate: resolvedDate,
            nextMaintenanceDate: dayjs(resolvedDate).add(3, 'month').toDate(),
            status: "Scheduled",
            mainteneceDoneBy: currentUser.employeeId,
          };
        } else if (payload.status === "Accepted") {
          // Upon acceptance, move status to Under Maintenance
          lcUpdate = {
            ...lc,
            status: "Under Maintenance",
            mainteneceDoneBy: currentUser.employeeId,
          };
        }

        if(Object.keys(lcUpdate).length) {
          await axios.put(`${biomedicalEndpoints.lifecycle.update(lc.id)}`, lcUpdate);
        }
      }

      showSnackbar("Maintenance request updated successfully", "success");
      closeEditDialog();
      fetchRequests();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update maintenance request", "error");
    }
  };

  // Accept maintenance request
  const acceptRequest = async (request) => {
    try {
      const payload = {
        ...request,
        accepted: true,
        status: "Accepted",
        technicianId: currentUser.employeeId,
      };
      await axios.put(`${biomedicalEndpoints.maintenance.update(request.id)}`, payload);

      // Also update equipment lifecycle as Under Maintenance on acceptance
      const lifecycle = await axios.get(`${biomedicalEndpoints.lifecycle.getByEquipmentId(request.equipmentId)}`);
      if (lifecycle && lifecycle.data) {
        const lc = lifecycle.data;
        await axios.put(`${biomedicalEndpoints.lifecycle.update(lc.id)}`, {
          ...lc,
          status: "Under Maintenance",
          mainteneceDoneBy: currentUser.employeeId,
        });
      }

      showSnackbar("Request accepted and equipment marked Under Maintenance", "success");
      fetchRequests();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to accept request", "error");
    }
  };

  // Filter requests by search, status, and type
  const filteredRequests = requests.filter(r => {
    // Status filter
    if (statusFilter && r.status !== statusFilter) return false;

    // Type filter
    if (typeFilter && r.maintenanceType !== typeFilter) return false;

    // Search filter on equipmentId or equipment name
    const eqName = equipmentList.find(eq => eq.id === r.equipmentId || eq._id === r.equipmentId)?.name || "";
    const searchLower = searchText.toLowerCase();
    if (searchText && !(
      (r.equipmentId && r.equipmentId.toLowerCase().includes(searchLower)) ||
      (eqName.toLowerCase().includes(searchLower))
    )) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const pagedRequests = filteredRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      {!currentUser || !currentUser.employeeId ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          Loading user info...
        </Typography>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Maintenance Requests
          </Typography>

          {/* Stats */}
          <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
            <StatsCard label="Pending" value={stats.Pending} />
            <StatsCard label="Accepted" value={stats.Accepted} />
            <StatsCard label="In Progress" value={stats["In Progress"]} />
            <StatsCard label="Resolved" value={stats.Resolved} />
          </Stack>

          {/* Filters */}
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              <TextField
                size="small"
                label="Search Equipment"
                placeholder="ID or Name"
                variant="outlined"
                value={searchText}
                onChange={handleSearchChange}
                sx={{ minWidth: 200 }}
              />
              <TextField
                size="small"
                select
                label="Status"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">All</MenuItem>
                {STATUS_OPTIONS.map(st => (
                  <MenuItem key={st.value} value={st.value}>{st.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                size="small"
                select
                label="Type"
                value={typeFilter}
                onChange={handleTypeFilterChange}
                sx={{ minWidth: 160 }}
              >
                {TYPE_OPTIONS.map(tp => (
                  <MenuItem key={tp.value} value={tp.value}>{tp.label}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </Stack>

          {/* Requests Table */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper>
              <TableContainer sx={{ maxHeight: 540 }}>
                <Table stickyHeader size="small" aria-label="maintenance requests table">
                  <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                    <TableRow>
                      <TableCell>Equipment Name</TableCell>
                      <TableCell>Issue</TableCell>
                      <TableCell>Reported By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Reported At</TableCell>
                      <TableCell>Accepted</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell width={140}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No maintenance requests found.
                        </TableCell>
                      </TableRow>
                    ) : pagedRequests.map(request => {
                      const eqName = equipmentList.find(eq => eq.id === request.equipmentId || eq._id === request.equipmentId)?.name || request.equipmentId;
                      return (
                        <TableRow hover key={request.id || request._id}>
                          <TableCell>{eqName}</TableCell>
                          <TableCell>{request.issueDescription || "-"}</TableCell>
                          <TableCell>{request.reportedBy || "-"}</TableCell>
                          <TableCell>
                            <Chip
                              label={request.status}
                              color={
                                request.status === "Resolved" ? "success" :
                                request.status === "In Progress" ? "primary" :
                                request.status === "Accepted" ? "info" :
                                "warning"
                              }
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{request.maintenanceType || "-"}</TableCell>
                          <TableCell>{request.reportedAt ? dayjs(request.reportedAt).format("DD-MM-YYYY HH:mm") : "-"}</TableCell>
                          <TableCell>{request.accepted ? "Yes" : "No"}</TableCell>
                          <TableCell>{request.department || "-"}</TableCell>
                          <TableCell>
                            {!request.accepted ? (
                              <Button size="small" variant="outlined" color="primary" onClick={() => acceptRequest(request)}>
                                Accept
                              </Button>
                            ) : (
                              <Button size="small" variant="outlined" onClick={() => openEditDialog(request)}>
                                View / Edit
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {filteredRequests.length > rowsPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2, bgcolor: theme.palette.grey[50] }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    shape="rounded"
                  />
                </Box>
              )}
            </Paper>
          )}

          {/* Edit Request Dialog */}
          <Dialog open={editOpen} onClose={closeEditDialog} maxWidth="sm" fullWidth>
            <DialogTitle>Modify Maintenance Request</DialogTitle>
            {editRequest ? (
              <>
                <DialogContent>
                  <TextField
                    label="Equipment Name"
                    value={equipmentList.find(eq => eq.id === editRequest.equipmentId || eq._id === editRequest.equipmentId)?.name || editRequest.equipmentId || "-"}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                  <TextField
                    label="Department"
                    value={editRequest.department || "-"}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                  <TextField
                    label="Reported By"
                    value={editRequest.reportedBy || "-"}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                  <TextField
                    label="Issue Description"
                    value={editRequest.issueDescription || "-"}
                    fullWidth
                    margin="dense"
                    multiline
                    disabled
                  />
                  <TextField
                    label="Type"
                    value={editRequest.maintenanceType || "-"}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                  <TextField
                    label="Reported At"
                    value={editRequest.reportedAt ? dayjs(editRequest.reportedAt).format("DD-MM-YYYY HH:mm") : "-"}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                  <TextField
                    label="Resolved At"
                    value={editRequest.resolvedAt ? dayjs(editRequest.resolvedAt).format("DD-MM-YYYY HH:mm") : "-"}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                  <TextField
                    label="Status"
                    select
                    name="status"
                    value={editRequest.status || ""}
                    onChange={handleEditChange}
                    fullWidth
                    margin="dense"
                    disabled={editRequest.status === "Resolved" || !editRequest.accepted}
                  >
                    {/* Only allow editing In Progress and Resolved */}
                    {editRequest.accepted && STATUS_OPTIONS.filter(st => ["In Progress", "Resolved"].includes(st.value)).map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Maintenance Notes"
                    name="maintenanceNotes"
                    value={editRequest.maintenanceNotes || ""}
                    onChange={handleEditChange}
                    multiline
                    rows={3}
                    fullWidth
                    margin="dense"
                    disabled={editRequest.status === "Resolved" || !editRequest.accepted}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeEditDialog}>Cancel</Button>
                  <Button
                    onClick={submitEditRequest}
                    // disabled={!editRequest.accepted || editRequest.status === "Resolved"}
                    disabled={!editRequest?.accepted || editRequest?.resolvedAt !== null}
                    variant="contained"
                    color="primary"
                  >
                    Update
                  </Button>
                </DialogActions>
              </>
            ) : (
              <DialogContent>
                <Typography>Loading...</Typography>
              </DialogContent>
            )}
          </Dialog>
        </>
      )}
    </Box>
  );
}
