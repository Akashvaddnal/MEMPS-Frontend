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
  Autocomplete,
  Chip,
  Stack
} from "@mui/material";
import axios from "axios";
import { biomedicalEndpoints } from "../../api/biomedicalEndpoints";
import dayjs from "dayjs";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];
const MAINTENANCE_TYPES = ["Preventive", "Corrective"];

async function fetchEquipments(department) {
  if (!department) return [];
  try {
    const res = await axios.get(biomedicalEndpoints.SEARCH_DEPARTMENT_EQUIPMENTS(department));
    return res.data || [];
  } catch {
    return [];
  }
}

const MaintenanceRequests = ({ currentUser }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    equipmentId: "",
    issueDescription: "",
    maintenanceType: "Preventive"
  });

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch filter requests for user's dept or own reports
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(biomedicalEndpoints.GET_ALL_MAINTENANCE_REQUESTS);
      let filtered = res.data || [];
      if (currentUser?.department) {
        filtered = filtered.filter(
          r =>
            r.department === currentUser.department ||
            r.department === currentUser.departmentName ||
            r.reportedBy === currentUser.username
        );
      }
      setRequests(filtered);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load equipments for autocomplete
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

  // Fetch requests initially & on change
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const openForm = () => {
    setForm({ equipmentId: "", issueDescription: "", maintenanceType: "Preventive" });
    setOpen(true);
  };

  const closeForm = () => setOpen(false);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEquipmentChange = (event, newVal) => {
    setForm(prev => ({
      ...prev,
      equipmentId: newVal ? (newVal.id || newVal._id) : ""
    }));
  };

  const handleSubmit = async () => {
    if (!form.equipmentId || !form.issueDescription || !form.maintenanceType) {
      alert("Please fill all fields.");
      return;
    }
    try {
      await axios.post(biomedicalEndpoints.CREATE_MAINTENANCE_REQUEST, {
        equipmentId: form.equipmentId,
        issueDescription: form.issueDescription,
        maintenanceType: form.maintenanceType,
        status: "Pending",
        department: currentUser.department || currentUser.departmentName || "",
        reportedBy: currentUser.username || currentUser.name || "",
        technicianId: null,
        reportedAt: new Date().toISOString(),
        resolvedAt: null,
        maintenanceNotes: ""
      });
      alert("Maintenance request submitted!");
      setOpen(false);
      fetchRequests();
    } catch {
      alert("Failed to submit maintenance request.");
    }
  };

  const openViewDialog = req => {
    setSelectedRequest(req);
    setViewOpen(true);
  };

  const closeViewDialog = () => {
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
                      {req.reportedAt ? dayjs(req.reportedAt).format("DD-MM-YYYY HH:mm") : "-"}
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => openViewDialog(req)}>
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

      {/* Request Form Dialog */}
      <Dialog open={open} onClose={closeForm} maxWidth="xs" fullWidth>
        <DialogTitle>Raise Maintenance Request</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={equipmentOptions}
            getOptionLabel={option => `${option.id || option._id} - ${option.name}`}
            onChange={handleEquipmentChange}
            renderInput={params => (
              <TextField {...params} label="Equipment" margin="dense" required helperText="Search equipment" />
            )}
            value={
              form.equipmentId ? equipmentOptions.find(eq => eq.id === form.equipmentId || eq._id === form.equipmentId) : null
            }
            disableClearable
          />
          <TextField label="Department" margin="dense" fullWidth disabled value={currentUser.department || currentUser.departmentName || ""} />
          <TextField label="Reported By" margin="dense" fullWidth disabled value={currentUser.username || currentUser.name || ""} />
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
            label="Maintenance Type"
            name="maintenanceType"
            margin="dense"
            select
            fullWidth
            required
            value={form.maintenanceType}
            onChange={handleFormChange}
            SelectProps={{ native: true }}
          >
            {MAINTENANCE_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </TextField>
          <TextField label="Status" margin="dense" fullWidth value="Pending" disabled />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details View Dialog */}
      <Dialog open={viewOpen} onClose={closeViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Maintenance Request Details - {selectedRequest?.equipmentId}</DialogTitle>
        <DialogContent dividers>
          {selectedRequest ? (
            <Stack spacing={1}>
              <Typography><b>Issue:</b> {selectedRequest.issueDescription}</Typography>
              <Typography><b>Type:</b> {selectedRequest.maintenanceType}</Typography>
              <Typography><b>Status:</b> {selectedRequest.status}</Typography>
              <Typography><b>Reported By:</b> {selectedRequest.reportedBy}</Typography>
              <Typography><b>Department:</b> {selectedRequest.department}</Typography>
              <Typography><b>Reported At:</b> {selectedRequest.reportedAt ? dayjs(selectedRequest.reportedAt).format("DD-MM-YYYY HH:mm") : "N/A"}</Typography>
              <Typography><b>Resolved At:</b> {selectedRequest.resolvedAt ? dayjs(selectedRequest.resolvedAt).format("DD-MM-YYYY HH:mm") : "N/A"}</Typography>
              <Typography><b>Technician ID:</b> {selectedRequest.technicianId || "N/A"}</Typography>
              <Typography><b>Notes:</b> {selectedRequest.maintenanceNotes || "N/A"}</Typography>
            </Stack>
          ) : (
            <Typography>No details available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceRequests;
