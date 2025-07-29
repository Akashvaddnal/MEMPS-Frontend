import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import { STAFF_ENDPOINTS } from "../../API/hospitalStaffEndpoints";
import EquipmentCard from "./EquipmentCard"; // reuse your existing card

const EquipmentListPage = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEquipments() {
      setLoading(true);
      try {
        const res = await axios.get(STAFF_ENDPOINTS.GET_ALL_EQUIPMENT);
        setEquipmentList(res.data || []);
      } catch {
        setEquipmentList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEquipments();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        All Equipments
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {equipmentList.map((eq) => (
            <Grid item xs={12} sm={6} md={4} key={eq.id || eq._id}>
              <EquipmentCard equipment={eq} />
            </Grid>
          ))}
          {equipmentList.length === 0 && (
            <Typography>No equipments found.</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default EquipmentListPage;
