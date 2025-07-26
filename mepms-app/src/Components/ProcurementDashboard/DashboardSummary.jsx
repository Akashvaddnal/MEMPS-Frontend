import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Paper, Typography, useTheme, Stack } from '@mui/material';
import EquipmentIcon from '@mui/icons-material/MedicalServices';
import VendorIcon from '@mui/icons-material/Store';
import OrderIcon from '@mui/icons-material/Receipt';
import AlertIcon from '@mui/icons-material/Warning';

export default function DashboardSummary({ 
  equipmentCount, 
  vendorCount, 
  orderCount, 
  alertCount 
}) {
  const theme = useTheme();

  const cardData = [
    {
      label: 'Total Equipment',
      value: equipmentCount,
      icon: <EquipmentIcon sx={{ fontSize: 42, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Vendors',
      value: vendorCount,
      icon: <VendorIcon sx={{ fontSize: 42, color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
    },
    {
      label: 'Purchase Orders',
      value: orderCount,
      icon: <OrderIcon sx={{ fontSize: 42, color: theme.palette.warning.main }} />,
      color: theme.palette.warning.main,
    },
    {
      label: 'Stock Alerts',
      value: alertCount,
      icon: <AlertIcon sx={{ fontSize: 42, color: theme.palette.error.main }} />,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Grid container spacing={3}>
        {cardData.map(({ label, value, icon, color }) => (
             <Grid xs={12} sm={6} md={3}>
            <Paper elevation={4} sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 2 }}>
              <Box sx={{ mr: 3 }}>{icon}</Box>
              <Stack>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
                  {label}
                </Typography>
                <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
                  {value}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

DashboardSummary.propTypes = {
  equipmentCount: PropTypes.number.isRequired,
  vendorCount: PropTypes.number.isRequired,
  orderCount: PropTypes.number.isRequired,
  alertCount: PropTypes.number.isRequired,
};