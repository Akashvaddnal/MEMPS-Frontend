// src/components/dashboard/AnalyticsCharts.jsx

import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const usageData = [
  { name: "ICU", usageCount: 40 },
  { name: "Radiology", usageCount: 30 },
  { name: "General Ward", usageCount: 20 },
  { name: "Surgery", usageCount: 10 },
];

const lifecycleData = [
  { name: "Expired", value: 5, color: "#f44336" },
  { name: "Near Expiry", value: 7, color: "#ff9800" },
  { name: "Ok", value: 30, color: "#4caf50" },
];

const AnalyticsCharts = () => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-around">
      <Paper
        sx={{ m: 2, p: 2, minWidth: 320, flex: "1 1 45%" }}
        elevation={3}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Equipment Usage Trends by Department
        </Typography>
        <BarChart width={350} height={250} data={usageData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="usageCount" fill="#1976d2" />
        </BarChart>
      </Paper>

      <Paper
        sx={{ m: 2, p: 2, minWidth: 320, flex: "1 1 45%" }}
        elevation={3}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Equipment Lifecycle Status
        </Typography>
        <PieChart width={350} height={250}>
          <Pie
            data={lifecycleData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {lifecycleData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Paper>
    </Box>
  );
};

export default AnalyticsCharts;
