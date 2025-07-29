// src/components/dashboard/EquipmentLifeCycleTable.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { EQUIPMENT_LIFECYCLE_ENDPOINTS } from "../../api/endpoints";

const EquipmentLifeCycleTable = () => {
  const [lifeCycles, setLifeCycles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    equipmentId: "",
    acquisitionDate: dayjs().format("YYYY-MM-DD"),
    warrantyExpirationDate: dayjs().add(1, "year").format("YYYY-MM-DD"),
    expectedEndOfLife: dayjs().add(5, "year").format("YYYY-MM-DD"),
    maintenanceCount: 0,
    totalMaintenanceCost: 0,
    lastMaintenanceDate: "",
    nextMaintenanceDate: "",
  });

  // Fetch and normalize backend data
  const fetchLifeCycles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(EQUIPMENT_LIFECYCLE_ENDPOINTS.GET_ALL);
      const data = response.data || [];

      const mappedData = data.map((item) => ({
        id: item.id || item._id,
        equipmentId: item.equipmentId || item.equipment_id || "",
        acquisitionDate: item.acquisitionDate || item.acquisition_date || "",
        warrantyExpirationDate: item.warrantyExpirationDate || item.warranty_expiry || "",
        expectedEndOfLife: item.expectedEndOfLife || item.expected_end_of_life || "",
        maintenanceCount: item.maintenanceCount ?? item.maintenance_count ?? 0,
        totalMaintenanceCost: item.totalMaintenanceCost ?? item.total_maintenance_cost ?? 0,
        lastMaintenanceDate: item.lastMaintenanceDate || item.last_maintenance_date || "",
        nextMaintenanceDate: item.nextMaintenanceDate || "",
      }));

      setLifeCycles(mappedData);
    } catch (err) {
      alert("Failed to fetch equipment lifecycles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLifeCycles();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openNewDialog = () => {
    setFormData({
      equipmentId: "",
      acquisitionDate: dayjs().format("YYYY-MM-DD"),
      warrantyExpirationDate: dayjs().add(1, "year").format("YYYY-MM-DD"),
      expectedEndOfLife: dayjs().add(5, "year").format("YYYY-MM-DD"),
      maintenanceCount: 0,
      totalMaintenanceCost: 0,
      lastMaintenanceDate: "",
      nextMaintenanceDate: "",
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (lifeCycle) => {
    setFormData({
      equipmentId: lifeCycle.equipmentId || "",
      acquisitionDate: lifeCycle.acquisitionDate
        ? dayjs(lifeCycle.acquisitionDate).format("YYYY-MM-DD")
        : "",
      warrantyExpirationDate: lifeCycle.warrantyExpirationDate
        ? dayjs(lifeCycle.warrantyExpirationDate).format("YYYY-MM-DD")
        : "",
      expectedEndOfLife: lifeCycle.expectedEndOfLife
        ? dayjs(lifeCycle.expectedEndOfLife).format("YYYY-MM-DD")
        : "",
      maintenanceCount: lifeCycle.maintenanceCount || 0,
      totalMaintenanceCost: lifeCycle.totalMaintenanceCost || 0,
      lastMaintenanceDate: lifeCycle.lastMaintenanceDate
        ? dayjs(lifeCycle.lastMaintenanceDate).format("YYYY-MM-DD")
        : "",
      nextMaintenanceDate: lifeCycle.nextMaintenanceDate
        ? dayjs(lifeCycle.nextMaintenanceDate).format("YYYY-MM-DD")
        : "",
    });
    setEditingId(lifeCycle.id);
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "maintenanceCount" || name === "totalMaintenanceCost") {
      // Convert to number for these fields
      setFormData((fd) => ({ ...fd, [name]: Number(value) }));
    } else {
      setFormData((fd) => ({ ...fd, [name]: value }));
    }
  };



    const handleSubmit = async () => {
  const payload = {
    equipmentId: formData.equipmentId,
    acquisitionDate: formData.acquisitionDate
      ? new Date(formData.acquisitionDate).toISOString()
      : null,
    warrantyExpirationDate: formData.warrantyExpirationDate
      ? new Date(formData.warrantyExpirationDate).toISOString()
      : null,
    expectedEndOfLife: formData.expectedEndOfLife
      ? new Date(formData.expectedEndOfLife).toISOString()
      : null,
    maintenanceCount: formData.maintenanceCount,
    totalMaintenanceCost: formData.totalMaintenanceCost,
    lastMaintenanceDate: formData.lastMaintenanceDate
      ? new Date(formData.lastMaintenanceDate).toISOString()
      : null,
    nextMaintenanceDate: formData.nextMaintenanceDate
      ? new Date(formData.nextMaintenanceDate).toISOString()
      : null,
  };

  try {
    if (editingId) {
      await axios.put(EQUIPMENT_LIFECYCLE_ENDPOINTS.UPDATE(editingId), payload);
      setLifeCycles((prev) =>
        prev.map((lc) => (lc.id === editingId ? { ...lc, ...payload } : lc))
      );
    } else {
      const res = await axios.post(EQUIPMENT_LIFECYCLE_ENDPOINTS.CREATE, payload);
      setLifeCycles((prev) => [...prev, res.data]);
    }
    closeDialog();
  } catch (err) {
    alert("Failed to save equipment lifecycle");
    console.error(err);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lifecycle entry?")) return;

    try {
      await axios.delete(EQUIPMENT_LIFECYCLE_ENDPOINTS.DELETE(id));
      setLifeCycles((prev) => prev.filter((lc) => lc.id !== id));
    } catch {
      alert("Failed to delete entry");
    }
  };

  return (
    <Box>
      <Button variant="contained" sx={{ my: 2 }} onClick={openNewDialog}>
        Add Equipment Lifecycle
      </Button>

      {loading && <Typography>Loading...</Typography>}

      <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Equipment ID</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell>Warranty Expiry</TableCell>
              <TableCell>Lifecycle Expiry</TableCell>
              <TableCell>Maintenance Count</TableCell>
              <TableCell>Total Maintenance Cost</TableCell>
              <TableCell>Last Maintenance Date</TableCell>
              <TableCell>Next Maintenance Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lifeCycles.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
            {lifeCycles
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((lc) => (
                <TableRow key={lc.id}>
                  <TableCell>{lc.equipmentId}</TableCell>
                  <TableCell>
                    {lc.acquisitionDate && dayjs(lc.acquisitionDate).isValid()
                      ? dayjs(lc.acquisitionDate).format("YYYY-MM-DD")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {lc.warrantyExpirationDate && dayjs(lc.warrantyExpirationDate).isValid()
                      ? dayjs(lc.warrantyExpirationDate).format("YYYY-MM-DD")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {lc.expectedEndOfLife && dayjs(lc.expectedEndOfLife).isValid()
                      ? dayjs(lc.expectedEndOfLife).format("YYYY-MM-DD")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{lc.maintenanceCount ?? 0}</TableCell>
                  <TableCell>{lc.totalMaintenanceCost ?? 0}</TableCell>
                  <TableCell>
                    {lc.lastMaintenanceDate && dayjs(lc.lastMaintenanceDate).isValid()
                      ? dayjs(lc.lastMaintenanceDate).format("YYYY-MM-DD")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {lc.nextMaintenanceDate && dayjs(lc.nextMaintenanceDate).isValid()
                      ? dayjs(lc.nextMaintenanceDate).format("YYYY-MM-DD")
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => openEditDialog(lc)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(lc.id)}>
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
        count={lifeCycles.length}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? "Edit Equipment Lifecycle" : "Add Equipment Lifecycle"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Equipment ID"
            name="equipmentId"
            fullWidth
            margin="dense"
            value={formData.equipmentId}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Purchase Date"
            name="acquisitionDate"
            type="date"
            fullWidth
            margin="dense"
            value={formData.acquisitionDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Warranty Expiry"
            name="warrantyExpirationDate"
            type="date"
            fullWidth
            margin="dense"
            value={formData.warrantyExpirationDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Lifecycle Expiry"
            name="expectedEndOfLife"
            type="date"
            fullWidth
            margin="dense"
            value={formData.expectedEndOfLife}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Maintenance Count"
            name="maintenanceCount"
            type="number"
            fullWidth
            margin="dense"
            value={formData.maintenanceCount}
            onChange={handleInputChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            label="Total Maintenance Cost"
            name="totalMaintenanceCost"
            type="number"
            fullWidth
            margin="dense"
            value={formData.totalMaintenanceCost}
            onChange={handleInputChange}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
          />
          <TextField
            label="Last Maintenance Date"
            name="lastMaintenanceDate"
            type="date"
            fullWidth
            margin="dense"
            value={formData.lastMaintenanceDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Next Maintenance Date"
            name="nextMaintenanceDate"
            type="date"
            fullWidth
            margin="dense"
            value={formData.nextMaintenanceDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentLifeCycleTable;
