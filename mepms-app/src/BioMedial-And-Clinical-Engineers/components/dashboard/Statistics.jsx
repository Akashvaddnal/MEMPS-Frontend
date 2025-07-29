import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

const StatisticCard = ({ title, value, color }) => {
  return (
    <Paper sx={{ p: 2, textAlign: 'center' }} elevation={3}>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="h4" color={color || "primary"}>{value}</Typography>
    </Paper>
  );
};

const Statistics = ({ stats }) => {
  if (!stats) return null;

  const items = [
    { title: 'Total Equipments', value: stats.totalEquipments },
    { title: 'Faulty Equipments', value: stats.faultyEquipments, color: 'error' },
    { title: 'Functional Equipments', value: stats.functionalEquipments, color: 'success' },
    { title: 'Under Maintenance', value: stats.underMaintenance, color: 'warning' },
    { title: 'Total Maintenance Requests', value: stats.totalMaintenanceRequests },
    { title: 'Pending Maintenance Requests', value: stats.pendingMaintenanceRequests, color: 'warning' },
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <StatisticCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Statistics;
