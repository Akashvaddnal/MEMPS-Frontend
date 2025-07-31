import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Paper, CircularProgress, Toolbar } from "@mui/material";
import axios from "axios";
import { biomedicalEndpoints } from "../../api/biomedicalEndpoints";
import Statistics from "./Statistics";

export default function Dashboard({ currentUser }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [equipmentRes, maintenanceRes] = await Promise.all([
          axios.get(biomedicalEndpoints.equipment.getAll),
          axios.get(biomedicalEndpoints.maintenance.getAll)
        ]);

        let equipments = equipmentRes.data || [];
        let maintenances = maintenanceRes.data || [];

        if(currentUser && currentUser.department) {
          equipments = equipments.filter(eq => eq.department === currentUser.department || eq.department === currentUser.departmentName);
          maintenances = maintenances.filter(mt => mt.department === currentUser.department || mt.department === currentUser.departmentName);
        }

        const counts = {
          totalEquipments: equipments.length,
          faultyEquipments: equipments.filter(eq => eq.status === "Faulty").length,
          functionalEquipments: equipments.filter(eq => eq.status === "Functional").length,
          underMaintenanceEquipments: equipments.filter(eq => eq.status === "Under Maintenance").length,
          totalRequests: maintenances.length,
          pendingRequests: maintenances.filter(mt => mt.status === "Pending").length,
          // Add more stats if needed...
        };

        setStats(counts);
      } catch (err) {
        console.error(err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [currentUser]);

  if(!currentUser) return <Typography>Please login to view the dashboard.</Typography>;
  if(loading) return <CircularProgress />;

  if(!stats) return <Typography>Failed to load statistics.</Typography>;

  return (
    <Box>
      <Typography variant="h4" mb={3}>Dashboard Overview</Typography>
      <Grid container spacing={3}>
        {[
          { label: "Total Equipments", value: stats.totalEquipments },
          { label: "Faulty Equipments", value: stats.faultyEquipments },
          { label: "Functional Equipments", value: stats.functionalEquipments },
          { label: "Under Maintenance", value: stats.underMaintenanceEquipments },
          { label: "Maintenance Requests", value: stats.totalRequests },
          { label: "Pending Maintenance Requests", value: stats.pendingRequests }
        ].map(stat => (
          <Grid key={stat.label} item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="subtitle1">{stat.label}</Typography>
              <Typography variant="h5" color="primary">{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
