import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Box
} from "@mui/material";

const EquipmentCard = ({ equipment, onReserve }) => {
  return (
    <Card sx={{ maxWidth: 345, m: "auto" }}>
      <CardMedia
        component="img"
        height="140"
        image={equipment.image}
        alt={equipment.name}
        onError={e => e.target.src="/images/default-equipment.png"} // fallback
        />
      <CardContent>
        <Typography variant="h6" gutterBottom>{equipment.name}</Typography>
        <Stack spacing={0.5}>
          <Typography variant="body2"><b>ID:</b> {equipment.id || equipment._id || "-"}</Typography>
          <Typography variant="body2"><b>Model:</b> {equipment.model || "-"}</Typography>
          <Typography variant="body2"><b>Status:</b> <Chip size="small" label={equipment.status} color={equipment.status === "Functional" ? "success" : "error"} /></Typography>
          <Typography variant="body2"><b>Availability:</b> {equipment.availability || "Unknown"}</Typography>
          <Box mt={2}>
            <Button variant="contained" size="small" fullWidth onClick={() => onReserve(equipment)} disabled={equipment.status !== "Functional"}>
              Reserve
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;
