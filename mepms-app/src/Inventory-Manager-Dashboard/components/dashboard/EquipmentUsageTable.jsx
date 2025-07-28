// src/components/dashboard/EquipmentUsageTable.jsx

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
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { EQUIPMENT_USAGE_ENDPOINTS } from "../../api/endpoints";

const STATUS_OPTIONS = ["In Use", "Reserved", "Available", "Maintenance"];

const EquipmentUsageTable = () => {
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    equipmentId: "",
    usedBy: "",
    reservedBy: "",
    status: "Available",
    usageStart: dayjs().format("YYYY-MM-DD"),
    usageEnd: dayjs().add(1, "day").format("YYYY-MM-DD"),
  });

  const fetchUsages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(EQUIPMENT_USAGE_ENDPOINTS.GET_ALL);
      setUsages(res.data || []);
    } catch {
      alert("Failed to fetch equipment usage");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsages();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openNewDialog = () => {
    setFormData({
      equipmentId: "",
      usedBy: "",
      reservedBy: "",
      status: "Available",
      usageStart: dayjs().format("YYYY-MM-DD"),
      usageEnd: dayjs().add(1, "day").format("YYYY-MM-DD"),
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (usage) => {
    setFormData({
      equipmentId: usage.equipmentId || "",
      usedBy: usage.usedBy || "",
      reservedBy: usage.reservedBy || "",
      status: usage.status || "Available",
      usageStart: dayjs(usage.usageStart).format("YYYY-MM-DD"),
      usageEnd: dayjs(usage.usageEnd).format("YYYY-MM-DD"),
    });
    setEditingId(usage.id);
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      usageStart: new Date(formData.usageStart).toISOString(),
      usageEnd: new Date(formData.usageEnd).toISOString(),
    };

    try {
      if (editingId) {
        await axios.put(EQUIPMENT_USAGE_ENDPOINTS.UPDATE(editingId), payload);
        setUsages((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...payload } : u)));
      } else {
        const res = await axios.post(EQUIPMENT_USAGE_ENDPOINTS.CREATE, payload);
        setUsages((prev) => [...prev, res.data]);
      }
      closeDialog();
    } catch {
      alert("Failed to save equipment usage data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this usage record?")) return;

    try {
      await axios.delete(EQUIPMENT_USAGE_ENDPOINTS.DELETE(id));
      setUsages((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <Box>
      <Button variant="contained" sx={{ my: 2 }} onClick={openNewDialog}>
        Add Equipment Usage
      </Button>

      {loading && <Typography>Loading...</Typography>}

      <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Equipment ID</TableCell>
              <TableCell>Used By</TableCell>
              <TableCell>Reserved By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Usage Start</TableCell>
              <TableCell>Usage End</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usages.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No equipment usage found
                </TableCell>
              </TableRow>
            )}
            {usages
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((usage) => (
                <TableRow key={usage.id}>
                  <TableCell>{usage.equipmentId}</TableCell>
                  <TableCell>{usage.usedBy || "-"}</TableCell>
                  <TableCell>{usage.reservedBy || "-"}</TableCell>
                  <TableCell>{usage.status}</TableCell>
                  <TableCell>{dayjs(usage.usageStart).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>{dayjs(usage.usageEnd).format("YYYY-MM-DD")}</TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => openEditDialog(usage)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(usage.id)}>
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
        count={usages.length}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Equipment Usage" : "Add Equipment Usage"}</DialogTitle>
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
            label="Used By"
            name="usedBy"
            fullWidth
            margin="dense"
            value={formData.usedBy}
            onChange={handleInputChange}
          />
          <TextField
            label="Reserved By"
            name="reservedBy"
            fullWidth
            margin="dense"
            value={formData.reservedBy}
            onChange={handleInputChange}
          />
          <TextField
            select
            label="Status"
            name="status"
            fullWidth
            margin="dense"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Usage Start Date"
            name="usageStart"
            type="date"
            fullWidth
            margin="dense"
            value={formData.usageStart}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Usage End Date"
            name="usageEnd"
            type="date"
            fullWidth
            margin="dense"
            value={formData.usageEnd}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
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

export default EquipmentUsageTable;
