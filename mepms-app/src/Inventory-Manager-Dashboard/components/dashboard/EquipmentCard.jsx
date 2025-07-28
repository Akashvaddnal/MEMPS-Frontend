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
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import {
  EQUIPMENT_ENDPOINTS,
  EQUIPMENT_USAGE_ENDPOINTS,
  MAINTENANCE_REQUEST_ENDPOINTS,
} from "../../api/endpoints";

// Helper for date display fields
function formatDate(dateString, fmt = "YYYY-MM-DD") {
  if (!dateString) return "";
  const d = dayjs(dateString);
  return d.isValid() ? d.format(fmt) : "";
}

const STATUS_OPTIONS = ["Functional", "Under Repair", "Out of Service", "Available", "Maintenance"];

const EquipmentCard = ({ equipment, onUpdate, onDelete }) => {
  const [imageFile, setImageFile] = useState(null);
  const [usageData, setUsageData] = useState([]);
  const [currentUsage, setCurrentUsage] = useState(null);
  const [reservedUsage, setReservedUsage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  // Dialog form state for all equipment fields
  const [formData, setFormData] = useState({ ...equipment });

  // Maintenance modal
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    issueDescription: "",
    maintenanceType: "Preventive",
  });

  // Effect: whenever equipment prop changes or dialog opens, reset form
  useEffect(() => {
    setFormData({ ...equipment });
    setEditing(false);
    setImageFile(null);
  }, [equipment, isDialogOpen]);

  // Fetch usage info for display & linking by equipmentId
  const fetchUsageData = useCallback(async () => {
    if (!equipment?.id) return;
    try {
      const res = await axios.get(EQUIPMENT_USAGE_ENDPOINTS.GET_BY_EQUIPMENT_ID(equipment.id));
      const data = res.data || [];
      setUsageData(data);

      // Logic for currently "in use"
      const now = dayjs();
      const running = data.find((u) => {
        const start = dayjs(u.usageStart || u.usage_start);
        const end = dayjs(u.usageEnd || u.usage_end);
        return u.status === "In Use" && now.isAfter(start) && now.isBefore(end);
      });
      setCurrentUsage(running || null);

      const future = data
        .filter(
          (u) => {
            const start = dayjs(u.usageStart || u.usage_start);
            return (u.status === "Reserved" || u.status === "Scheduled") && start.isAfter(now);
          }
        )
        .sort((a, b) =>
          dayjs(a.usageStart || a.usage_start).unix() - dayjs(b.usageStart || b.usage_start).unix()
        );
      setReservedUsage(future.length > 0 ? future[0] : null);
    } catch {
      setUsageData([]);
      setCurrentUsage(null);
      setReservedUsage(null);
    }
  }, [equipment?.id]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  // Image upload helpers
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Card summary content
  const isAvailable = !currentUsage;
  const usedBy = currentUsage?.usedBy || currentUsage?.used_by || "-";
  const reservedBy = reservedUsage?.reservedBy || reservedUsage?.reserved_by || "-";
  const usagePurpose = currentUsage?.purpose || reservedUsage?.purpose || "-";
  const usageTime = currentUsage
    ? `${formatDate(currentUsage.usageStart || currentUsage.usage_start, "HH:mm")} - ${formatDate(
        currentUsage.usageEnd || currentUsage.usage_end,
        "HH:mm"
      )}`
    : reservedUsage
    ? formatDate(reservedUsage.usageStart || reservedUsage.usage_start, "YYYY-MM-DD HH:mm")
    : "-";

  // In-card summary
  return (
    <>
      {/* <Card sx={{ width: 340, m: 1, display: "flex", flexDirection: "column" }}>
        <CardMedia
          component="img"
          height={160}
          image={equipment.image || undefined}
          alt={equipment.name || "Equipment Image"}
          sx={{ objectFit: "contain", bgcolor: "#f2f2f2" }}
        /> */}
        <Card sx={{ width: 340, m: 1, display: "flex", flexDirection: "column" }}>
        <CardMedia
            component="img"
            height={160}
            image={equipment.image || undefined}
            alt={equipment.name || "Equipment Image"}
            sx={{
            width: "100%",
            height: 160,
            objectFit: "cover", // Fills entire box and crops as needed
            bgcolor: "#f2f2f2",
            display: "block",
            }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{equipment.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {equipment.model} &nbsp;|&nbsp; S/N: {equipment.serialNumber}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>Status: {equipment.status}</Typography>
          <Typography>Location: {equipment.location || "-"}</Typography>
          <Typography>Quantity: {equipment.quantity}</Typography>
          <Typography color={isAvailable ? "success.main" : "warning.main"}>
            {isAvailable ? "Available" : "In Use"}
          </Typography>
          <Typography>
            <span>Used by: </span>
            <b>{usedBy}</b>
          </Typography>
          <Typography>
            <span>Reserved by: </span>
            <b>{reservedBy}</b>
          </Typography>
          <Typography noWrap title={usagePurpose}>
            Purpose: {usagePurpose}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsDialogOpen(true)}
          >
            View Details
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => onDelete(equipment.id)}
          >
            Delete
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
            variant="contained"
            onClick={() => setEditing((e) => !e)}
            size="small"
          >
            {editing ? "Cancel Edit" : "Edit"}
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* All fields, most as display-only unless editing */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={formData.name || ""}
                disabled
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Model"
                name="model"
                value={formData.model || ""}
                disabled
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Serial Number"
                name="serialNumber"
                value={formData.serialNumber || ""}
                disabled
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                value={formData.category || ""}
                onChange={editing ? e => setFormData(f => ({ ...f, category: e.target.value })) : undefined}
                disabled={!editing}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location || ""}
                onChange={editing ? e => setFormData(f => ({ ...f, location: e.target.value })) : undefined}
                disabled={!editing}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={editing ? e => setFormData(f => ({ ...f, quantity: Number(e.target.value) })) : undefined}
                disabled={!editing}
                fullWidth
                margin="dense"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" disabled={!editing}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status || "Available"}
                  label="Status"
                  onChange={editing ? e => setFormData(f => ({ ...f, status: e.target.value })) : undefined}
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
                disabled
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Warranty End Date"
                name="warrantyEndDate"
                value={formatDate(formData.warrantyEndDate)}
                disabled
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Expected Life (months)"
                name="expectedLife"
                value={formData.expectedLife || ""}
                disabled
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Created At"
                name="createdAt"
                value={formatDate(formData.createdAt)}
                disabled
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Updated At"
                name="updatedAt"
                value={formatDate(formData.updatedAt)}
                disabled
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                size="small"
                component="label"
                fullWidth
                disabled={!editing}
              >
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
              <Button
                variant="contained"
                size="small"
                disabled={!imageFile || !editing}
                onClick={async () => {
                  if (!imageFile) return;
                  const base64Image = await toBase64(imageFile);
                  // Send only image update
                  const payload = { ...formData, image: base64Image };
                  const res = await axios.put(EQUIPMENT_ENDPOINTS.UPDATE(equipment.id), payload, {
                    headers: { "Content-Type": "application/json" },
                  });
                  setFormData(res.data);
                  onUpdate(res.data);
                  setImageFile(null);
                }}
                sx={{ ml: 2 }}
              >
                Save Image
              </Button>
            </Grid>
            {/* Usage info section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mt: 3 }}>
                Usage Status: {isAvailable ? "Available" : (
                  currentUsage ? (
                    <>In Use by <b>{usedBy}</b>, Purpose: <i>{usagePurpose}</i></>
                  ) : "In Use"
                )}
              </Typography>
              {currentUsage && (
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Start: {formatDate(currentUsage.usageStart || currentUsage.usage_start, "YYYY-MM-DD HH:mm")}
                  &nbsp;–&nbsp;
                  End: {formatDate(currentUsage.usageEnd || currentUsage.usage_end, "YYYY-MM-DD HH:mm")}
                </Typography>
              )}
              {reservedUsage && (
                <Typography variant="body2" sx={{ mt: 2, ml: 1, color: "#cc9800" }}>
                  Reserved by: {reservedBy} &middot; Starts: {formatDate(reservedUsage.usageStart || reservedUsage.usage_start, "YYYY-MM-DD HH:mm")}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {editing && (
            <Button
              variant="contained"
              onClick={async () => {
                // Prepare payload for save
                const payload = {
                  ...formData,
                  purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : "",
                  warrantyEndDate: formData.warrantyEndDate ? new Date(formData.warrantyEndDate).toISOString() : "",
                  createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString() : "",
                  updatedAt: new Date().toISOString(),
                };
                try {
                  const res = await axios.put(EQUIPMENT_ENDPOINTS.UPDATE(equipment.id), payload, {
                    headers: { "Content-Type": "application/json" },
                  });
                  setFormData(res.data);
                  setEditing(false);
                  onUpdate(res.data);
                } catch (err) {
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
            color="secondary"
          >
            Raise Maintenance
          </Button>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
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
