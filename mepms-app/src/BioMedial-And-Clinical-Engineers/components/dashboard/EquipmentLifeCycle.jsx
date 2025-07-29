import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from "@mui/material";
import axios from "axios";
import { biomedicalEndpoints } from "../../api/biomedicalEndpoints";
import dayjs from "dayjs";

const EquipmentLifeCycle = ({ currentUser }) => {
  const [lifeCycles, setLifeCycles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLifeCycles() {
      setLoading(true);
      try {
        const res = await axios.get(biomedicalEndpoints.LifecycleEndpoints ?? biomedicalEndpoints.GET_ALL_LIFECYCLE);
        let filtered = res.data || [];
        if (currentUser?.department) {
          filtered = filtered.filter(item => item.department === currentUser.department || item.department === currentUser.departmentName);
        }
        setLifeCycles(filtered);
      } catch {
        setLifeCycles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLifeCycles();
  }, [currentUser]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Equipment Life Cycle</Typography>
      {loading ? <CircularProgress /> : (
        <Paper>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Equipment ID</TableCell>
                <TableCell>Last Maintenance Date</TableCell>
                <TableCell>Next Maintenance Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lifeCycles.length === 0 && (
                <TableRow><TableCell colSpan={4}>No data available</TableCell></TableRow>
              )}
              {lifeCycles.map(item => (
                <TableRow key={item.id || item._id}>
                  <TableCell>{item.equipmentId || "-"}</TableCell>
                  <TableCell>{item.lastMaintenanceDate ? dayjs(item.lastMaintenanceDate).format("DD-MM-YYYY") : "-"}</TableCell>
                  <TableCell>{item.nextMaintenanceDate ? dayjs(item.nextMaintenanceDate).format("DD-MM-YYYY") : "-"}</TableCell>
                  <TableCell>{item.status || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default EquipmentLifeCycle;
