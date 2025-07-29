// import React from "react";
// import { Card, CardContent, CardMedia, Typography, Chip, Box } from "@mui/material";

// const EquipmentCard = ({ equipment }) => {
//   return (
//     <Card sx={{ maxWidth: 345 }}>
//       <CardMedia
//         component="img"
//         height="140"
//         image={equipment.image || "/no-equipment.png"}
//         alt={equipment.name}
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h6" component="div">
//           {equipment.name}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Model: {equipment.model}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Serial #: {equipment.serialNumber}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//           Status:{" "}
//           <Chip
//             label={equipment.status || "Unknown"}
//             color={equipment.status === "Functional" ? "success" : "default"}
//             size="small"
//           />
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//           Availability:{" "}
//           <Chip
//             label={equipment.currentStock > 0 ? "Available" : "Unavailable"}
//             color={equipment.currentStock > 0 ? "success" : "error"}
//             size="small"
//           />
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default EquipmentCard;


import React, { useState } from "react";
import {
  Card, CardContent, CardMedia, Typography, Chip,
  Box, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Stack
} from "@mui/material";
import axios from "axios";
import { STAFF_ENDPOINTS } from "../../API/hospitalStaffEndpoints";

// Accepts `equipment`, and currentUser as prop (for user info in form)
const EquipmentCard = ({ equipment, currentUser }) => {
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [form, setForm] = useState({
    usageStart: "",
    usageEnd: "",
    purpose: "",

  });
  const [loading, setLoading] = useState(false);

  // Reset form when opening/closing
  const openDialog = () => {
    setForm({ usageStart: "", usageEnd: "", purpose: "" });
    setReserveDialogOpen(true);
  };
  const closeDialog = () => setReserveDialogOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleReserve = async () => {
    if (!form.usageStart || !form.usageEnd || !form.purpose) {
      alert("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(STAFF_ENDPOINTS.CREATE_USAGE_REQUEST, {
        equipmentId: equipment.id || equipment._id,
        usedBy: currentUser?.username || currentUser?.id, // Adjust as per API
        usageStart: form.usageStart,
        usageEnd: form.usageEnd,
        purpose: form.purpose,
        department:  currentUser?.department || currentUser?.departmentName, // optional
        status: "Reserved"
      });
      alert("User department: " + (currentUser?.department || "Unknown"));
      alert("Equipment reservation submitted!");
      setReserveDialogOpen(false);
    } catch (err) {
      alert("Failed to reserve equipment.");
    }
    setLoading(false);
  };
 

  return (
    <>
      <Card sx={{ minWidth: 250, maxWidth: 560,  mx: "auto", boxShadow: 3, borderRadius: 2 }}>
        <CardMedia
          component="img"
          alt={equipment.name}
          image={equipment.image || "/no-equipment.png"}
          height="160"
          sx={{ objectFit: "cover", bgcolor: "#f5f5fa" }}
        />
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {equipment.name}
          </Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              <b>Model:</b> {equipment.model}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Serial:</b> {equipment.serialNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Type:</b> {equipment.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Status:</b>{" "}
              <Chip
                size="small"
                label={equipment.status || "Unknown"}
                color={equipment.status === "Functional" ? "success" : "error"}
                variant="outlined"
              />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Availability:</b>{" "}
              <Chip
                size="small"
                label={equipment.currentStock > 0 ? "Available" : "Unavailable"}
                color={equipment.currentStock > 0 ? "success" : "warning"}
                variant="filled"
              />
            </Typography>
          </Stack>
          <Box mt={2}>
            <Button
              size="small"
              variant="contained"
              fullWidth
              disabled={equipment.currentStock <= 0}
              onClick={openDialog}
            >
              Reserve
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={reserveDialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Reserve Equipment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Purpose"
            name="purpose"
            value={form.purpose}
            onChange={handleFormChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            type="datetime-local"
            label="Usage Start"
            name="usageStart"
            value={form.usageStart}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            type="datetime-local"
            label="Usage End"
            name="usageEnd"
            value={form.usageEnd}
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={handleReserve}
            variant="contained"
            disabled={
              !form.usageStart ||
              !form.usageEnd ||
              !form.purpose ||
              form.usageEnd < form.usageStart ||
              loading
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EquipmentCard;
