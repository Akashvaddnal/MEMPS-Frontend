
// src/components/inventory/EquipmentCard.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Divider,
  Chip,
  Tooltip,
  Avatar,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import {
  EQUIPMENT_ENDPOINTS,
  EQUIPMENT_USAGE_ENDPOINTS,
  DEPARTMENT_ENDPOINTS,
  MAINTENANCE_REQUEST_ENDPOINTS,
} from "../../api/endpoints";
// import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

/**
 * Parse and format various date formats consistently.
 * @param {*} dateInput can be:
 *   - string ISO date
 *   - string verbose date (e.g. "Sat May 10 13:30:00 IST 2025")
 *   - object with {$date: string}
 * @param {string} fmt format string (default: "YYYY-MM-DD")
 * @returns formatted date string or "-"
 */
function formatDate(dateInput, fmt = "YYYY-MM-DD") {
  if (!dateInput) return "-";

  // If dateInput is object with $date
  if (typeof dateInput === "object" && "$date" in dateInput) {
    dateInput = dateInput.$date;
  }

  // Try parse with dayjs ISO first
  let d = dayjs(dateInput);

  if (d.isValid()) {
    return d.format(fmt);
  }

  // Try parsing verbose format e.g. Sat May 10 13:30:00 IST 2025
  // Define a common format string
  const verboseFormat = "ddd MMM DD HH:mm:ss [IST] YYYY";

  d = dayjs(dateInput, verboseFormat, true);
  if (d.isValid()) {
    return d.format(fmt);
  }

  // Fallback: try JS Date parsing (not always reliable but may help)
  const jsDate = new Date(dateInput);
  if (!isNaN(jsDate.getTime())) {
    return dayjs(jsDate).format(fmt);
  }

  // Otherwise invalid date
  return "-";
}


// Helper for displaying formatted dates (with fallback)
// function formatDate(dateString, fmt = "YYYY-MM-DD") {
//   if (!dateString) return "-";
//   const d = dayjs(dateString);
//   return d.isValid() ? d.format(fmt) : "-";
// }

const STATUS_OPTIONS = [
  "Functional",
  "Under Repair",
  "Out of Service",
  "Available",
  "Maintenance",
];

const EquipmentCard = ({ equipment, onUpdate, onDelete }) => {
  // Image upload
  const [imageFile, setImageFile] = useState(null);

  // Dialog controls
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ ...equipment });

  // Usage info
  const [usageCount, setUsageCount] = useState(0);

  // Department allocation
  const [departmentsInfo, setDepartmentsInfo] = useState([]);

  // Maintenance
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    issueDescription: "",
    department:"Inventory",
    maintenanceType: "Preventive",
  });

  // Reset formData on open/receive new equipment
  useEffect(() => {
    setFormData({ ...equipment });
    setEditing(false);
    setImageFile(null);
  }, [equipment, isDialogOpen]);

  // Fetch current equipment usage
  const fetchUsageCount = useCallback(async () => {
    if (!equipment?.id) return;
    try {
      const response = await axios.get(
        EQUIPMENT_USAGE_ENDPOINTS.GET_BY_EQUIPMENT_ID(equipment.id)
      );
      const inUseCount = (response.data || []).filter(u => u.status === "In Use").length;
      setUsageCount(inUseCount);
    } catch {
      setUsageCount(0);
    }
  }, [equipment?.id]);

  // Fetch department assignments for this equipment
  const fetchDepartmentsInfo = useCallback(async () => {
    try {
      const res = await axios.get(DEPARTMENT_ENDPOINTS.GET_ALL);
      const equipmentId = equipment.id;
      setDepartmentsInfo(
        (res.data || [])
          .filter(dep => dep.equipmentInventory && dep.equipmentInventory[equipmentId] > 0)
          .map(dep => ({
            name: dep.name,
            count: dep.equipmentInventory[equipmentId],
            location: dep.location,
          }))
      );
    } catch {
      setDepartmentsInfo([]);
    }
  }, [equipment?.id]);

  useEffect(() => {
    fetchUsageCount();
    fetchDepartmentsInfo();
  }, [fetchUsageCount, fetchDepartmentsInfo]);

  // Image file to base64 helper
  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });

  // Core Card UI
  return (
    <>
      <Card sx={{ width: 360, m: 1, display: "flex", flexDirection: "column", borderRadius: 3, boxShadow: 6 }}>
        <CardMedia
          component="img"
          height={180}
          image={equipment.image || "/no-equipment.png"}
          alt={equipment.name || "Equipment"}
          sx={{ bgcolor: "#f6f6fa", objectFit: "cover", borderRadius: "8px 8px 0 0" }}
        />
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>{equipment.name}</Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">Model: <b>{equipment.model}</b></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Serial #: <b>{equipment.serialNumber}</b></Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">Category: <b>{equipment.category}</b></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Total: <b>{equipment.quantity}</b></Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Available:{" "}
                <Chip
                  label={equipment.currentStock || 0}
                  color={equipment.currentStock > 0 ? "success" : "default"}
                  size="small"
                  sx={{ fontWeight: "bold", fontSize: 14 }}
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Type: <b>{equipment.category || "-"}</b>
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <Typography color={equipment.currentStock > 0 ? "success.main" : "error.main"} fontWeight={600}>
                {equipment.currentStock > 0 ? "Available" : "Unavailable"}
              </Typography>
            </Grid>
            <Grid item>
              {usageCount > 0 && (
                <Tooltip title="Currently in use by departments or users">
                  <Chip
                    icon={<Avatar sx={{ width: 20, height: 20, bgcolor: "#f5b144" }}>{usageCount}</Avatar>}
                    label={`In Use`}
                    color="warning"
                    size="small"
                    sx={{ ml: 0.5, fontWeight: 500 }}
                  />
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button variant="contained" size="small" onClick={() => setIsDialogOpen(true)}>
            View
          </Button>
          <Button size="small" color="error" variant="outlined" onClick={() => onDelete(equipment.id || equipment._id)}>
            Remove
          </Button>
        </CardActions>
      </Card>

      {/* DETAILS DIALOG */}
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setEditing(false);
          setIsDialogOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Equipment Details
          <Button
            sx={{ float: "right" }}
            variant={editing ? "outlined" : "contained"}
            onClick={() => setEditing(e => !e)}
            size="small"
          >
            {editing ? "Cancel Edit" : "Edit"}
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Image */}
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={formData.image || "/no-equipment.png"}
                  alt={formData.name}
                  style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 12, background: "#f0f0f3" }}
                />
                <Box mt={1}>
                  <Button variant="outlined" size="small" component="label" disabled={!editing}>
                    Upload
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={e => setImageFile(e.target.files && e.target.files[0])}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ ml: 1 }}
                    disabled={!imageFile || !editing}
                    onClick={async () => {
                      if (!imageFile) return;
                      const base64Image = await toBase64(imageFile);
                      const payload = { ...formData, image: base64Image, updatedAt: new Date().toISOString() };
                      const res = await axios.put(EQUIPMENT_ENDPOINTS.UPDATE(equipment.id), payload, {
                        headers: { "Content-Type": "application/json" },
                      });
                      setFormData(res.data);
                      setImageFile(null);
                      onUpdate(res.data);
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Info fields */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name || ""}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Model"
                    name="model"
                    value={formData.model || ""}
                    fullWidth
                    margin="dense"
                    disabled={!editing}
                    onChange={e =>
                      setFormData(f => ({ ...f, model: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Serial Number"
                    name="serialNumber"
                    value={formData.serialNumber || ""}
                    fullWidth
                    margin="dense"
                    disabled={!editing}
                    onChange={e =>
                      setFormData(f => ({ ...f, serialNumber: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    name="category"
                    value={formData.category || ""}
                    fullWidth
                    margin="dense"
                    disabled={!editing}
                    onChange={e =>
                      setFormData(f => ({ ...f, category: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    name="location"
                    value={formData.location || ""}
                    fullWidth
                    margin="dense"
                    disabled={!editing}
                    onChange={e =>
                      setFormData(f => ({ ...f, location: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    fullWidth
                    margin="dense"
                    inputProps={{ min: 0 }}
                    disabled={!editing}
                    onChange={e =>
                      setFormData(f => ({ ...f, quantity: Number(e.target.value) }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense" disabled={!editing}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status || "Available"}
                      label="Status"
                      onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Purchase Date"
                    name="purchaseDate"
                    value={formatDate(formData.purchaseDate)}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Warranty End Date"
                    name="warrantyEndDate"
                    value={formatDate(formData.warrantyEndDate)}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expected Life (months)"
                    name="expectedLife"
                    value={formData.expectedLife || ""}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Created At"
                    name="createdAt"
                    value={formatDate(formData.createdAt)}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Updated At"
                    name="updatedAt"
                    value={formatDate(formData.updatedAt)}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Current Stock"
                    name="currentStock"
                    value={formData.currentStock}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Department/Usage summary */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Department Allocations
          </Typography>
          {departmentsInfo.length > 0 ? (
            departmentsInfo.map(dep => (
              <Typography key={dep.name} sx={{ mb: 0.5 }}>
                <b>{dep.name}</b> ({dep.location}) &ndash; <b>{dep.count}</b> unit{dep.count > 1 ? "s" : ""}
              </Typography>
            ))
          ) : (
            <Typography color="text.secondary">No department assignments.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {editing && (
            <Button
              variant="contained"
              onClick={async () => {
                const payload = {
                  ...formData,
                  updatedAt: new Date().toISOString(),
                };
                try {
                  const res = await axios.put(EQUIPMENT_ENDPOINTS.UPDATE(equipment.id), payload, {
                    headers: { "Content-Type": "application/json" },
                  });
                  setFormData(res.data);
                  setEditing(false);
                  onUpdate(res.data);
                } catch {
                  alert("Failed to update equipment");
                }
              }}
            >
              Save
            </Button>
          )}
          <Button
            onClick={() => setIsMaintenanceOpen(true)}
            variant="outlined"
            color="info"
            sx={{ ml: 1 }}
          >
            Raise Maintenance
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              console.log("Delete equipment:", equipment.id || equipment._id);
              if (window.confirm("Are you sure you want to delete this equipment?"))
                onDelete(equipment.id || equipment._id);

            }}
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              setEditing(false);
              setIsDialogOpen(false);
            }}
            color="primary"
            sx={{ ml: 1 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance Modal */}
      <Dialog open={isMaintenanceOpen} onClose={() => setIsMaintenanceOpen(false)}>
        <DialogTitle>Raise Maintenance Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            minRows={3}
            label="Issue Description"
            name="issueDescription"
            fullWidth
            value={maintenanceForm.issueDescription}
            onChange={e => setMaintenanceForm(f => ({ ...f, issueDescription: e.target.value }))}
            required
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Maintenance Type</InputLabel>
            <Select
              label="Maintenance Type"
              name="maintenanceType"
              value={maintenanceForm.maintenanceType}
              onChange={e => setMaintenanceForm(f => ({ ...f, maintenanceType: e.target.value }))}
            >
              <MenuItem value="Preventive">Preventive</MenuItem>
              <MenuItem value="Corrective">Corrective</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMaintenanceOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!maintenanceForm.issueDescription) {
                alert("Please enter the issue description");
                return;
              }
              const payload = {
                equipmentId: equipment.id,
                reportedBy: "Inventory Manager",
                 department:"Inventory",
                issueDescription: maintenanceForm.issueDescription,
                maintenanceType: maintenanceForm.maintenanceType,
                status: "Pending",
                reportedAt: new Date().toISOString(),
              };
              try {
                await axios.post(MAINTENANCE_REQUEST_ENDPOINTS.CREATE, payload);
                alert("Maintenance request submitted.");
                setIsMaintenanceOpen(false);
                setMaintenanceForm({ issueDescription: "", maintenanceType: "Preventive" });
              } catch {
                alert("Failed to submit maintenance request");
              }
            }}
            disabled={!maintenanceForm.issueDescription}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EquipmentCard;
