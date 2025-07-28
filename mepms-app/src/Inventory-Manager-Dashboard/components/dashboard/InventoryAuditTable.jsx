// src/components/dashboard/InventoryAuditTable.jsx

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
import { INVENTORY_AUDIT_ENDPOINTS } from "../../api/endpoints";

const STATUS_OPTIONS = ["Completed", "Failed", "Partial"];
const AUDIT_TYPES = ["Full", "Partial", "Spot"];

const InventoryAuditTable = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    auditType: "",
    datePerformed: dayjs().format("YYYY-MM-DD"),
    performedBy: "",
    itemsChecked: 0,
    discrepancies: 0,
    status: "Completed",
    notes: "",
  });

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const response = await axios.get(INVENTORY_AUDIT_ENDPOINTS.GET_ALL);
      setAudits(response.data || []);
    } catch (err) {
      alert("Failed to fetch inventory audits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openNewDialog = () => {
    setFormData({
      auditType: "",
      datePerformed: dayjs().format("YYYY-MM-DD"),
      performedBy: "",
      itemsChecked: 0,
      discrepancies: 0,
      status: "Completed",
      notes: "",
    });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (audit) => {
    setFormData({
      auditType: audit.auditType,
      datePerformed: dayjs(audit.datePerformed).format("YYYY-MM-DD"),
      performedBy: audit.performedBy,
      itemsChecked: audit.itemsChecked,
      discrepancies: audit.discrepancies,
      status: audit.status,
      notes: audit.notes || "",
    });
    setEditingId(audit.id);
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
      datePerformed: new Date(formData.datePerformed).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await axios.put(INVENTORY_AUDIT_ENDPOINTS.UPDATE(editingId), payload);
        setAudits((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...payload } : a)));
      } else {
        const res = await axios.post(INVENTORY_AUDIT_ENDPOINTS.CREATE, payload);
        setAudits((prev) => [...prev, res.data]);
      }
      closeDialog();
    } catch (err) {
      console.log(err);
      alert("Failed to save inventory audit");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.delete(INVENTORY_AUDIT_ENDPOINTS.DELETE(id));
      setAudits((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete entry");
    }
  };

  return (
    <Box>
      <Button variant="contained" sx={{ my: 2 }} onClick={openNewDialog}>
        Add Inventory Audit
      </Button>
      {loading && <Typography>Loading...</Typography>}

      <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Audit Type</TableCell>
              <TableCell>Date Performed</TableCell>
              <TableCell>Performed By</TableCell>
              <TableCell>Items Checked</TableCell>
              <TableCell>Discrepancies</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audits.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No inventory audits available
                </TableCell>
              </TableRow>
            )}
            {audits
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell>{audit.auditType}</TableCell>
                  <TableCell>{dayjs(audit.datePerformed).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>{audit.performedBy}</TableCell>
                  <TableCell>{audit.itemsChecked}</TableCell>
                  <TableCell>{audit.discrepancies}</TableCell>
                  <TableCell>{audit.status}</TableCell>
                  <TableCell>{audit.notes}</TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => openEditDialog(audit)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(audit.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={audits.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Inventory Audit" : "Add Inventory Audit"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            label="Audit Type"
            name="auditType"
            fullWidth
            margin="dense"
            value={formData.auditType}
            onChange={handleInputChange}
            required
          >
            {AUDIT_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date Performed"
            name="datePerformed"
            type="date"
            fullWidth
            margin="dense"
            value={formData.datePerformed}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Performed By"
            name="performedBy"
            fullWidth
            margin="dense"
            value={formData.performedBy}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Items Checked"
            name="itemsChecked"
            type="number"
            fullWidth
            margin="dense"
            value={formData.itemsChecked}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Discrepancies"
            name="discrepancies"
            type="number"
            fullWidth
            margin="dense"
            value={formData.discrepancies}
            onChange={handleInputChange}
            required
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
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes"
            name="notes"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={formData.notes}
            onChange={handleInputChange}
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

export default InventoryAuditTable;
