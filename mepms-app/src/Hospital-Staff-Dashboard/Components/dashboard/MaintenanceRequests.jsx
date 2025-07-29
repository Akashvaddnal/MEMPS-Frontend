// import React, { useEffect, useState } from "react";
// import {
//   Typography, Box, Paper, Table, TableBody, TableHead,
//   TableCell, TableContainer, TableRow, CircularProgress,
//   Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField
// } from "@mui/material";

// import axios from "axios";
// import { STAFF_ENDPOINTS } from "../../API/hospitalStaffEndpoints";

// const MaintenanceRequests = ({ currentUser }) => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Maintenance request form dialog
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({
//     equipmentId: "",
//     issueDescription: "",
//     maintenanceType: "Preventive",
//   });

//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(STAFF_ENDPOINTS.GET_ALL_MAINTENANCE_REQUESTS);
//         // Filter: Only show requests for this user's department if user is defined
//         const filtered = currentUser?.departmentName
//           ? (res.data || []).filter(r =>
//               (r.department === currentUser.departmentName) ||
//               (r.reportedBy === currentUser.username)
//             )
//           : (res.data || []);
//         setRequests(filtered);
//       } catch {
//         setRequests([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, [currentUser]);

//   const openDialog = () => {
//     setForm({ equipmentId: "", issueDescription: "", maintenanceType: "Preventive" });
//     setOpen(true);
//   };
//   const closeDialog = () => setOpen(false);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!form.equipmentId || !form.issueDescription || !form.maintenanceType) {
//       alert("Please fill all fields");
//       return;
//     }
//     try {
//       await axios.post(STAFF_ENDPOINTS.CREATE_MAINTENANCE_REQUEST, {
//         equipmentId: form.equipmentId,
//         issueDescription: form.issueDescription,
//         maintenanceType: form.maintenanceType,
//         status: "Pending",
//         department: currentUser?.departmentName,
//         reportedBy: currentUser?.username,
//         reportedAt: new Date().toISOString(),
//       });
//       setOpen(false);
//       alert("Maintenance request submitted!");
//       // Optionally re-fetch or add to table
//     } catch {
//       alert("Failed to submit request");
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Maintenance Requests
//       </Typography>
//       <Button onClick={openDialog} variant="contained" sx={{ mb: 2 }}>
//         Raise Maintenance Request
//       </Button>

//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <Paper>
//           <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Equipment ID</TableCell>
//                   <TableCell>Issue</TableCell>
//                   <TableCell>Reported By</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Type</TableCell>
//                   <TableCell>Reported At</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {requests.map((req) => (
//                   <TableRow key={req.id || req._id}>
//                     <TableCell>{req.equipmentId || "-"}</TableCell>
//                     <TableCell>{req.issueDescription || "-"}</TableCell>
//                     <TableCell>{req.reportedBy || "-"}</TableCell>
//                     <TableCell>{req.status || "-"}</TableCell>
//                     <TableCell>{req.maintenanceType || "-"}</TableCell>
//                     <TableCell>{new Date(req.reportedAt).toLocaleString() || "-"}</TableCell>
//                   </TableRow>
//                 ))}
//                 {requests.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={6} align="center">
//                       No maintenance requests found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       )}

//       {/* Maintenance Request Dialog */}
//       <Dialog open={open} onClose={closeDialog} maxWidth="xs" fullWidth>
//         <DialogTitle>Raise Maintenance Request</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Equipment ID"
//             name="equipmentId"
//             margin="dense"
//             fullWidth
//             required
//             value={form.equipmentId}
//             onChange={handleFormChange}
//           />
//           <TextField
//             label="Issue Description"
//             name="issueDescription"
//             margin="dense"
//             fullWidth
//             required
//             value={form.issueDescription}
//             onChange={handleFormChange}
//           />
//           <TextField
//             label="Maintenance Type"
//             name="maintenanceType"
//             margin="dense"
//             fullWidth
//             required
//             select
//             value={form.maintenanceType}
//             onChange={handleFormChange}
//           >
//             <option value="Preventive">Preventive</option>
//             <option value="Corrective">Corrective</option>
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeDialog}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default MaintenanceRequests;


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
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { STAFF_ENDPOINTS } from "../../API/hospitalStaffEndpoints"; // Ensure path correctness
import dayjs from "dayjs";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];
const MAINTENANCE_TYPES = ["Preventive", "Corrective"];

// Helper to get equipment list for autocomplete from department
async function fetchEquipments(department) {
  if (!department) return [];
  try {
    const res = await axios.get(STAFF_ENDPOINTS.SEARCH_DEPARTMENT_EQUIPMENTS(department));
    return res.data || [];
  } catch {
    return [];
  }
}


const MaintenanceRequests = ({ currentUser }) => {
  console.log("DEBUG MaintenanceRequests currentUser:", currentUser);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  // Form state
 // Debug log
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    equipmentId: "",
    issueDescription: "",
    maintenanceType: "Preventive",
  });

  // Fetch requests filtered by user's department and own reports
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(STAFF_ENDPOINTS.GET_ALL_MAINTENANCE_REQUESTS);
      const allRequests = res.data || [];
      if (currentUser?.department) {
        // Filter by user's department or own reports
        const filtered = allRequests.filter(
          r =>
            (r.department === currentUser.department || r.department === currentUser.departmentName) ||
            (r.reportedBy === currentUser.username)
        );
        setRequests(filtered);
      } else {
        setRequests(allRequests);
      }
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch equipment list for currentUser's department, for autocomplete
  useEffect(() => {
    async function loadEquipments() {
      if (currentUser?.department || currentUser?.departmentName) {
        const deptName = currentUser.department || currentUser.departmentName;
        const eqs = await fetchEquipments(deptName);
        setEquipmentOptions(eqs);
      }
    }
    loadEquipments();
  }, [currentUser]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Form open/close handlers
  const openForm = () => {
    setForm({
      equipmentId: "",
      issueDescription: "",
      maintenanceType: "Preventive",
    });
    setOpen(true);
  };

  const closeForm = () => setOpen(false);

  // Form change handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Equipment autocomplete change handler
  const handleEquipmentChange = (event, newValue) => {
    setForm(prev => ({
      ...prev,
      equipmentId: newValue ? (newValue.id || newValue._id) : "",
    }));
  };

  // Submit handler for raise maintenance request
  const handleSubmit = async () => {
    if (!form.equipmentId || !form.issueDescription || !form.maintenanceType) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      await axios.post(STAFF_ENDPOINTS.CREATE_MAINTENANCE_REQUEST, {
        equipmentId: form.equipmentId,
        issueDescription: form.issueDescription,
        maintenanceType: form.maintenanceType,
        status: "Pending",           // default and disabled in form
        department: currentUser.department || currentUser.departmentName || "",
        reportedBy: currentUser.username || currentUser.name || "",
        technicianId: null,          // not relevant here
        reportedAt: new Date().toISOString(),
        resolvedAt: null,
        maintenanceNotes: "",
      });
      alert("Maintenance request submitted successfully.");
      setOpen(false);
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error("Failed to submit maintenance request:", err);
      alert("Failed to submit maintenance request.");
    }
  };

  // Show details dialog for requests (optional: here we only track status)
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleViewOpen = (request) => {
    setSelectedRequest(request);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setSelectedRequest(null);
    setViewOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Maintenance Requests
      </Typography>

      <Button variant="contained" onClick={openForm} sx={{ mb: 2 }}>
        Raise Maintenance Request
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Equipment ID</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reported At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No maintenance requests found.
                    </TableCell>
                  </TableRow>
                )}
                {requests.map(req => (
                  <TableRow key={req.id || req._id}>
                    <TableCell>{req.equipmentId || "-"}</TableCell>
                    <TableCell>{req.issueDescription || "-"}</TableCell>
                    <TableCell>{req.reportedBy || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={req.status || "-"}
                        color={req.status === "Resolved" ? "success" : "warning"}
                        variant={req.status === "Resolved" ? "filled" : "outlined"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{req.maintenanceType || "-"}</TableCell>
                    <TableCell>
                      {req.reportedAt
                        ? new Date(req.reportedAt).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleViewOpen(req)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Raise Maintenance Request Dialog */}
      <Dialog open={open} onClose={closeForm} maxWidth="xs" fullWidth>
        <DialogTitle>Raise Maintenance Request</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={equipmentOptions}
            getOptionLabel={(option) => `${option.id || option._id} - ${option.name}`}
            onChange={handleEquipmentChange}
            renderInput={(params) => (
              <TextField {...params}
                label="Equipment"
                margin="dense"
                required
                helperText="Select equipment (searchable)"
              />
            )}
            value={
              form.equipmentId
                ? equipmentOptions.find(
                    (eq) => eq.id === form.equipmentId || eq._id === form.equipmentId
                  ) || null
                : null
            }
            disableClearable
          />

          <TextField
            label="Department"
            margin="dense"
            fullWidth
            value={currentUser.department || currentUser.departmentName || ""}
            disabled
          />

          <TextField
            label="Reported By"
            margin="dense"
            fullWidth
            value={currentUser.username || currentUser.name || ""}
            disabled
          />

          <TextField
            label="Issue Description"
            name="issueDescription"
            margin="dense"
            multiline
            rows={3}
            fullWidth
            required
            value={form.issueDescription}
            onChange={handleFormChange}
          />

          <TextField
            select
            label="Maintenance Type"
            name="maintenanceType"
            margin="dense"
            fullWidth
            required
            value={form.maintenanceType}
            onChange={handleFormChange}
            SelectProps={{ native: true }}
          >
            {["Preventive", "Corrective"].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </TextField>

          <TextField
            label="Status"
            margin="dense"
            fullWidth
            value="Pending"
            disabled
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Maintenance Request Dialog */}
      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Maintenance Request Details - {selectedRequest?.equipmentId || ""}
        </DialogTitle>
        <DialogContent>
          {selectedRequest ? (
            <Stack spacing={1}>
              <Typography><b>Issue Description:</b> {selectedRequest.issueDescription || "-"}</Typography>
              <Typography><b>Maintenance Type:</b> {selectedRequest.maintenanceType || "-"}</Typography>
              <Typography><b>Status:</b> {selectedRequest.status || "-"}</Typography>
              <Typography><b>Reported By:</b> {selectedRequest.reportedBy || "-"}</Typography>
              <Typography><b>Department:</b> {selectedRequest.department || "-"}</Typography>
              <Typography><b>Resolved At:</b> {selectedRequest.resolvedAt ? new Date(selectedRequest.resolvedAt).toLocaleString() : "N/A"}</Typography>
              <Typography><b>Technician ID:</b> {selectedRequest.technicianId || "N/A"}</Typography>
              <Typography><b>Maintenance Notes:</b> {selectedRequest.maintenanceNotes || "N/A"}</Typography>
            </Stack>
          ) : (
            <Typography>No details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceRequests;
