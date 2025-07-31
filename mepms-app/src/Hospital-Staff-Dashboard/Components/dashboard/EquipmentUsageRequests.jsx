import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { STAFF_ENDPOINTS } from "../../API/hospitalStaffEndpoints";

dayjs.extend(utc);

// Helper to normalize MongoDB extended JSON date fields
const normalizeDate = (date) => {
  if (!date) return null;
  if (typeof date === "string") return date;
  if (date.$date) return date.$date; // MongoDB extended JSON
  return date;
};

const EquipmentUsageRequests = ({ currentUser }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch usage requests filtered by current user's department
  const fetchUsageRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(STAFF_ENDPOINTS.GET_ALL_USAGE_REQUESTS);
      const allRequests = res.data || [];

      if (currentUser?.department) {
        // Filter usage requests to only those for currentUser's department
        const filtered = allRequests.filter(
          (r) =>
            r.department === currentUser.department ||
            (!r.department &&
              (r.reservedBy === currentUser.username || r.reserved_by === currentUser.username))
        );
        setRequests(filtered);
      } else {
        setRequests(allRequests);
      }
    } catch (error) {
      console.error("Error fetching usage requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Background monitor to update usage status for expired usages based on UTC time
  const monitorUsageStatus = useCallback(async () => {
    if (!requests.length) return;

    const nowUTC = dayjs.utc();
    const nowIST = nowUTC.add(330, 'minute');
    console.log("DEBUG: Current UTC time:", nowUTC.format());

    const expiredRequests = requests.filter((req) => {
      const usageEndRaw = req.usageEnd || req.usage_end;
      if (!usageEndRaw) return false;

      const usageEndStr = normalizeDate(usageEndRaw);
      if (!usageEndStr) return false;

      // Parse usage end as UTC
      const usageEndUTC = dayjs.utc(usageEndStr);

      return (
        ["In Use", "Reserved", "Active"].includes(req.status) &&
        usageEndUTC.isBefore(nowIST) // usageEndUTC < nowIST
      );
    });

    if (expiredRequests.length === 0) return; // Nothing to update

    setUpdating(true);

    try {
      // Update all expired requests status to "Released"
      await Promise.all(
        expiredRequests.map((req) =>
          axios.put(STAFF_ENDPOINTS.UPDATE_USAGE_REQUEST(req.id || req._id), {
            ...req,
            status: "Released",
          })
        )
      );

      // Refresh after updates
      await fetchUsageRequests();
    } catch (err) {
      console.error("Failed to update expired usage requests", err);
    } finally {
      setUpdating(false);
    }
  }, [requests, fetchUsageRequests]);

  useEffect(() => {
    fetchUsageRequests();
  }, [fetchUsageRequests]);

  useEffect(() => {
    // Monitor and update expired usage requests every 60 seconds
    const interval = setInterval(() => {
      monitorUsageStatus();
    }, 60000);

    // Run immediately on mount
    monitorUsageStatus();

    return () => clearInterval(interval);
  }, [monitorUsageStatus]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Equipment Usage Requests - Department: {currentUser?.department || "All"}
      </Typography>

      {loading || updating ? (
        <CircularProgress />
      ) : requests.length === 0 ? (
        <Typography>No usage requests found.</Typography>
      ) : (
        <Paper>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Equipment ID</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id || req._id}>
                    <TableCell>{req.equipmentId || req.equipment_id || "-"}</TableCell>
                    <TableCell>{req.reservedBy || req.reserved_by || "-"}</TableCell>
                    <TableCell>{req.purpose || "-"}</TableCell>
                    <TableCell>
                      {req.usageStart || req.usage_start
                        ? dayjs.utc(normalizeDate(req.usageStart || req.usage_start)).format(
                            "YYYY-MM-DD HH:mm:ss"
                          ) + " UTC"
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {req.usageEnd || req.usage_end
                        ? dayjs.utc(normalizeDate(req.usageEnd || req.usage_end)).format(
                            "YYYY-MM-DD HH:mm:ss"
                          ) + " UTC"
                        : "-"}
                    </TableCell>
                    <TableCell>{req.status || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default EquipmentUsageRequests;
