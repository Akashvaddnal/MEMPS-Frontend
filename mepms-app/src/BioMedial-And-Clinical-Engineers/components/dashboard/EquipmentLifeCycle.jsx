import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Stack,
  Card,
  MenuItem,
  Pagination,
  IconButton,
  InputAdornment,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add,
  Assignment,
  AssignmentTurnedIn,
  EventAvailable,
  PictureAsPdf,
  Visibility,
  Build,
  Event as EventIcon,
  Person,
  WarningAmber as WarningIcon,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { biomedicalEndpoints } from "../../api/biomedicalEndpoints";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const statsConfig = [
  { label: "Total", icon: <Add color="primary" fontSize="large" />, color: "#1976d2" },
  { label: "Scheduled", icon: <EventIcon color="info" fontSize="large" />, color: "#0288d1" },
  { label: "Maintained", icon: <Build color="success" fontSize="large" />, color: "#43a047" },
  { label: "Pending", icon: <Assignment color="warning" fontSize="large" />, color: "#fbc02d" },
];

const STATUS_OPTIONS = [
  { label: "Functional", value: "Functional" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Under Maintenance", value: "Under Maintenance" },
  { label: "Out of Service", value: "Out of Service" },
  { label: "Retired", value: "Retired" },
];

const initialFormData = {
  equipmentId: null,
  equipmentName: "",
  maintenanceCount: 0,
  lastMaintenanceDate: "",
  nextMaintenanceDate: "",
  status: "",
  remarks: "",
  mainteneceDoneBy: "",
  maintenanceCost: "",
};

const initialReserveForm = {
  usageStart: "",
  usageEnd: "",
  purpose: "",
};

const INFINITE_FUTURE_DATE = "9999-12-31T23:59:59Z";

export default function EquipmentLifecycle({ currentUser }) {
  // State declarations
  const [loading, setLoading] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [lifeCycles, setLifeCycles] = useState([]);
  const [equipmentMap, setEquipmentMap] = useState({});
  const [stats, setStats] = useState({ Total: 0, Scheduled: 0, Maintained: 0, Pending: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pendingByMe, setPendingByMe] = useState(false);
  const [maintainedByMe, setMaintainedByMe] = useState(false);
  const [dateFilters, setDateFilters] = useState({
    nextMaintenanceFrom: "",
    nextMaintenanceTo: "",
    lastMaintenanceFrom: "",
    lastMaintenanceTo: "",
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Dialog states
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [reserveForm, setReserveForm] = useState(initialReserveForm);
  const [isCompleteMode, setIsCompleteMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Calendar control state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState("month");

  const [calendarEvents, setCalendarEvents] = useState([]);

  // Snackbar helpers
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [equipRes, lcRes] = await Promise.all([
        axios.get(biomedicalEndpoints.equipment.getAll),
        axios.get(biomedicalEndpoints.lifecycle.getAll),
      ]);
      const eqData = Array.isArray(equipRes.data) ? equipRes.data : equipRes.data.equipments || [];
      setEquipmentList(eqData);

      const eqMapTemp = {};
      eqData.forEach((e) => {
        eqMapTemp[e.id || e._id] = e;
      });
      setEquipmentMap(eqMapTemp);

      const lcData = Array.isArray(lcRes.data) ? lcRes.data : lcRes.data.lifecycle || [];
      setLifeCycles(lcData);

      setStats({
        Total: lcData.length,
        Scheduled: lcData.filter((l) => l.status === "Scheduled").length,
        Maintained: lcData.filter((l) => l.lastMaintenanceDate && dayjs(l.lastMaintenanceDate).isSame(dayjs(), "month")).length,
        Pending: lcData.filter((l) => l.status === "Under Maintenance" || l.status === "Functional").length,
      });

      // Calendar events only for Scheduled status
      const calEvents = lcData
        .filter((l) => l.status === "Scheduled" && l.nextMaintenanceDate)
        .map((l) => ({
          title: `${eqMapTemp[l.equipmentId]?.name || l.equipmentId} Maintenance Scheduled`,
          start: new Date(l.nextMaintenanceDate),
          end: new Date(l.nextMaintenanceDate),
          allDay: true,
          resource: l,
        }));
      setCalendarEvents(calEvents);
    } catch (err) {
      showSnackbar("Failed to load data", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtering & Pagination
  const filteredRecords = lifeCycles.filter((l) => {
    if (pendingByMe && l.status !== "Scheduled") return false;
    if (maintainedByMe && l.mainteneceDoneBy !== currentUser.employeeId) return false;
    if (search) {
      const eq = equipmentMap[l.equipmentId];
      const inID = String(l.equipmentId ?? "").toLowerCase().includes(search.toLowerCase());
      const inName = eq && eq.name && eq.name.toLowerCase().includes(search.toLowerCase());
      if (!inID && !inName) return false;
    }
    if (statusFilter && l.status !== statusFilter) return false;
    const dateCheck = (field, from, to) => {
      if (!l[field]) return true;
      const val = dayjs(l[field]);
      if (from && val.isBefore(dayjs(from), "day")) return false;
      if (to && val.isAfter(dayjs(to), "day")) return false;
      return true;
    };
    if (!dateCheck("nextMaintenanceDate", dateFilters.nextMaintenanceFrom, dateFilters.nextMaintenanceTo)) return false;
    if (!dateCheck("lastMaintenanceDate", dateFilters.lastMaintenanceFrom, dateFilters.lastMaintenanceTo)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const pagedRecords = filteredRecords.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Handlers
  // const handleSnackbarClose = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const handlePageChange = (e, v) => setPage(v);
  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };
  const handleStatusChange = (e) => { setStatusFilter(e.target.value); setPage(1); };
  const handleDateFilterChange = (field) => (e) => { setDateFilters((p) => ({ ...p, [field]: e.target.value })); setPage(1); };
  const handlePendingToggle = () => { setPendingByMe(p => !p); setPage(1); };
  const handleMaintainedToggle = () => { setMaintainedByMe(p => !p); setPage(1); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleReserveChange = (e) => {
    const { name, value } = e.target;
    setReserveForm((p) => ({ ...p, [name]: value }));
  };

  // Dialog control
  const openScheduleDialog = (record) => {
    setFormData({
      ...initialFormData,
      ...record,
      equipmentId: record.equipmentId,
      equipmentName: equipmentMap[record.equipmentId]?.name || "",
      maintenanceCount: record.maintenanceCount || 0,
      mainteneceDoneBy: currentUser.employeeId,
    });
    setIsEditMode(true);
    setIsCompleteMode(false);
    setDialogOpen(true);
    setSelectedRecord(record);
  };

  const openCompleteDialog = (record) => {
    setFormData({
      ...initialFormData,
      ...record,
      equipmentId: record.equipmentId,
      equipmentName: equipmentMap[record.equipmentId]?.name || "",
      maintenanceCount: record.maintenanceCount || 0,
      nextMaintenanceDate: null,
      status: "Scheduled",
      maintenanceCost: "",
      mainteneceDoneBy: currentUser.employeeId,
    });
    setIsEditMode(true);
    setIsCompleteMode(true);
    setDialogOpen(true);
    setSelectedRecord(record);
  };

  const openReserveDialog = (record) => {
    setReserveForm(initialReserveForm);
    setSelectedRecord(record);
    setReserveDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setDialogOpen(false);
    setReserveDialogOpen(false);
    setReportDialogOpen(false);
    setCalendarOpen(false);
    setSelectedRecord(null);
    setFormData(initialFormData);
    setReserveForm(initialReserveForm);
    setIsEditMode(false);
    setIsCompleteMode(false);
  };

  // Actions
  const handleSchedule = async () => {
    if (!formData.nextMaintenanceDate) {
      alert("Please select next maintenance date");
      return;
    }
    try {
      await axios.put(`${biomedicalEndpoints.lifecycle.update(selectedRecord.id)}`, {
        ...selectedRecord,
        nextMaintenanceDate: formData.nextMaintenanceDate,
        status: "Scheduled",
        mainteneceDoneBy: currentUser.employeeId,
      });
      showSnackbar("Maintenance scheduled successfully", "success");
      closeAllDialogs();
      fetchData();
    } catch (err) {
      showSnackbar("Failed to schedule maintenance", "error");
      console.error(err);
    }
  };

  // const handleComplete = async () => {
  //   if (!formData.maintenanceCost) {
  //     alert("Please enter maintenance cost");
  //     return;
  //   }
  //   try {
  //     const prevCost = selectedRecord.totalMaintenanceCost || 0;
  //     const newCost = prevCost + Number(formData.maintenanceCost);
  //     await axios.put(`${biomedicalEndpoints.lifecycle.update(selectedRecord.id)}`, {
  //       ...selectedRecord,
  //       maintenanceCost: formData.maintenanceCost,
  //       totalMaintenanceCost: newCost,
  //       maintenanceCount: (selectedRecord.maintenanceCount || 0) + 1,
  //       lastMaintenanceDate: new Date(),
  //       nextMaintenanceDate: formData.nextMaintenanceDate || new Date(),
  //       status: "scheduled", // Changed to Functional after completion
  //       mainteneceDoneBy: currentUser.employeeId,
  //       nextMaintenanceDate: null, // Reset or can set per your logic
  //     });

  //     // You may want to update related usage reservation's usageEnd time here, if your backend supports it.

  //     showSnackbar("Maintenance marked as complete", "success");
  //     closeAllDialogs();
  //     fetchData();
  //   } catch (err) {
  //     showSnackbar("Failed to mark maintenance complete", "error");
  //     console.error(err);
  //   }
  // };

const handleComplete = async () => {
  if (!formData.maintenanceCost) {
    alert("Please enter maintenance cost");
    return;
  }
  try {
    const prevCost = selectedRecord.totalMaintenanceCost || 0;
    const newCost = prevCost + Number(formData.maintenanceCost);

    // Prepare nextMaintenanceDate by adding 3 months
    // let nextMaintenanceDate = formData.nextMaintenanceDate
    //   ? new Date(formData.nextMaintenanceDate)
    //   : new Date();
    // nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + 3);
    // let nextMaintenanceDate = formData.nextMaintenanceDate
    //     ? new Date(formData.nextMaintenanceDate) // Use as is
    //      : (() => { 
    //               const date = new Date();
    //               date.setMonth(date.getMonth() + 3);
    //               return date;
    //                })();
    let newNextMaintenanceDate;
if (formData.nextMaintenanceDate) {
  // Use the given date as is, no additional 3 months added
  newNextMaintenanceDate = new Date(formData.nextMaintenanceDate);
} else {
  // No date provided, so start with current date and add 3 months
  newNextMaintenanceDate = new Date();
  newNextMaintenanceDate.setMonth(newNextMaintenanceDate.getMonth() + 3);
}



    await axios.put(`${biomedicalEndpoints.lifecycle.update(selectedRecord.id)}`, {
      ...selectedRecord,
      maintenanceCost: formData.maintenanceCost,
      totalMaintenanceCost: newCost,
      maintenanceCount: (selectedRecord.maintenanceCount || 0) + 1,
      lastMaintenanceDate: new Date(),
      nextMaintenanceDate: newNextMaintenanceDate,
      status: "Scheduled", // or "Functional" if that is the correct status after maintenance
      mainteneceDoneBy: currentUser.employeeId,
      // Remove your existing `nextMaintenanceDate: null` here, since you want to update it with new value.
    });

    showSnackbar("Maintenance marked as complete", "success");
    closeAllDialogs();
    fetchData();
  } catch (err) {
    showSnackbar("Failed to mark maintenance complete", "error");
    console.error(err);
  }
};


  // Acquire for maintenance; creates usage with usageEnd infinite, changes status to Under Maintenance.
  const handleAcquireForMaintenance = async (record) => {
    if (!record.nextMaintenanceDate) {
      showSnackbar("No scheduled maintenance date to acquire", "warning");
      return;
    }
    try {
      // Create usage request
      await axios.post(biomedicalEndpoints.CREATE_USAGE_REQUEST, {
        equipmentId: record.equipmentId,
        reservedBy: currentUser.employeeId,
        usageStart: new Date(record.nextMaintenanceDate).toISOString(),
        usageEnd: INFINITE_FUTURE_DATE,
        department: currentUser.department || "",
        purpose: "Maintenance usage",
      });

      // Update lifecycle status to 'Under Maintenance'
      await axios.put(`${biomedicalEndpoints.lifecycle.update(record.id)}`, {
        ...record,
        status: "Under Maintenance",
        mainteneceDoneBy: currentUser.employeeId,
      });

      showSnackbar("Equipment acquired for maintenance", "success");
      closeAllDialogs();
      fetchData();
    } catch (err) {
      showSnackbar("Failed to acquire equipment for maintenance", "error");
      console.error(err);
    }
  };

  // Reserve usage
  const handleReserveSubmit = async () => {
    if (!reserveForm.usageStart || !reserveForm.usageEnd) {
      alert("Please select usage start and end dates");
      return;
    }
    if (!selectedRecord) {
      alert("No equipment selected");
      return;
    }
    try {
      await axios.post(biomedicalEndpoints.CREATE_USAGE_REQUEST, {
        equipmentId: selectedRecord.equipmentId,
        reservedBy: currentUser.employeeId,
        usageStart: new Date(reserveForm.usageStart).toISOString(),
        usageEnd: new Date(reserveForm.usageEnd).toISOString(),
        department: currentUser.department || "",
        purpose: reserveForm.purpose || "",
      });
      showSnackbar("Equipment usage reserved", "success");
      setReserveDialogOpen(false);
      fetchData();
    } catch (err) {
      showSnackbar("Failed to reserve equipment usage", "error");
      console.error(err);
    }
  };

  // Generate PDF report
  const generatePDFReport = () => {
    if (!selectedRecord) return;
    const doc = new jsPDF();
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const user = currentUser || {};

    // Header
    doc.setFontSize(20);
    doc.text("Medical Equipment Procurement & Management System", 14, 20);

    doc.setFontSize(14);
    doc.text("Department: " + (user.department || ""), 14, 28);
    doc.text("User: " + (user.email || "") + " (ID: " + (user.employeeId || "") + ")", 14, 36);

    doc.setFontSize(14);
    doc.text("Equipment Lifecycle Report", 14, 46);
    doc.setFontSize(12);
    doc.text(`Report Date/Time: ${now}`, 14, 54);
    doc.line(14, 58, 196, 58);

    // Details
    doc.text(`Equipment ID: ${selectedRecord.equipmentId || "-"}`, 14, 66);
    doc.text(`Equipment Name: ${equipmentMap[selectedRecord.equipmentId]?.name || "-"}`, 14, 74);
    doc.text(`Status: ${selectedRecord.status || "-"}`, 14, 82);
    doc.text(`Maintained By: ${selectedRecord.mainteneceDoneBy || "-"}`, 14, 90);
    doc.text(`Maintenance Count: ${selectedRecord.maintenanceCount ?? 0}`, 14, 98);
    doc.text(
      `Last Maintenance: ${selectedRecord.lastMaintenanceDate ? dayjs(selectedRecord.lastMaintenanceDate).format("YYYY-MM-DD") : "-"}`, 14, 106
    );
    doc.text(
      `Next Maintenance: ${selectedRecord.nextMaintenanceDate ? dayjs(selectedRecord.nextMaintenanceDate).format("YYYY-MM-DD") : "-"}`, 14, 114
    );
    doc.text(`Remarks: ${selectedRecord.purpose || "-"}`, 14, 122);

    doc.save(`LifecycleReport_${selectedRecord.equipmentId || "report"}.pdf`);
    setReportDialogOpen(false);
  };

  const openReportDialog = (record) => {
    setSelectedRecord(record);
    setReportDialogOpen(true);
  };


  // Render
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Equipment Lifecycle Management
      </Typography>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Calendar Button */}
      <Box sx={{ mb: 1, textAlign: "right" }}>
        <Button variant="outlined" startIcon={<EventIcon />} onClick={() => setCalendarOpen(true)}>
          View Maintenance Calendar
        </Button>
      </Box>

      {/* Stats */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
        {statsConfig.map((s) => (
          <Card
            key={s.label}
            sx={{
              p: 2,
              minWidth: 180,
              borderRadius: 3,
              boxShadow: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: s.color,
                color: "white",
                borderRadius: "50%",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {s.icon}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {s.label}
              </Typography>
              <Typography variant="h5">{stats[s.label] ?? 0}</Typography>
            </Box>
          </Card>
        ))}
      </Stack>

      {/* Filters */}
      <Stack spacing={2} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search equipment ID or name"
            value={search}
            onChange={handleSearchChange}
            InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon /></InputAdornment> }}
            sx={{ minWidth: 200 }}
            name="search"
            id="search"
          />
          <TextField
            size="small"
            select
            value={statusFilter}
            onChange={handleStatusChange}
            label="Status"
            sx={{ minWidth: 140 }}
            name="statusFilter"
            id="statusFilter"
          >
            <MenuItem value="">All Statuses</MenuItem>
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Next Maint From"
            type="date"
            value={dateFilters.nextMaintenanceFrom}
            onChange={handleDateFilterChange("nextMaintenanceFrom")}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
            name="nextMaintenanceFrom"
            id="nextMaintenanceFrom"
          />
          <TextField
            size="small"
            label="Next Maint To"
            type="date"
            value={dateFilters.nextMaintenanceTo}
            onChange={handleDateFilterChange("nextMaintenanceTo")}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
            name="nextMaintenanceTo"
            id="nextMaintenanceTo"
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
          <TextField
            size="small"
            label="Last Maint From"
            type="date"
            value={dateFilters.lastMaintenanceFrom}
            onChange={handleDateFilterChange("lastMaintenanceFrom")}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
            name="lastMaintenanceFrom"
            id="lastMaintenanceFrom"
          />
          <TextField
            size="small"
            label="Last Maint To"
            type="date"
            value={dateFilters.lastMaintenanceTo}
            onChange={handleDateFilterChange("lastMaintenanceTo")}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
            name="lastMaintenanceTo"
            id="lastMaintenanceTo"
          />
          <Button
            size="small"
            variant={pendingByMe ? "contained" : "outlined"}
            startIcon={<Assignment />}
            onClick={handlePendingToggle}
            sx={{ height: 40 }}
          >
            Pending
          </Button>
          <Button
            size="small"
            variant={maintainedByMe ? "contained" : "outlined"}
            startIcon={<Person />}
            onClick={handleMaintainedToggle}
            sx={{ height: 40 }}
          >
            Maintained by Me
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      {loading ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Equipment ID</TableCell>
                  <TableCell>Equipment Name</TableCell>
                  <TableCell>Maintenance Count</TableCell>
                  <TableCell>Last Maintenance</TableCell>
                  <TableCell>Next Maintenance</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Maintained By</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No records match the filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRecords.map((item) => {
                    const eq = equipmentMap[item.equipmentId];
                    return (
                      <TableRow key={item.id || item._id}>
                        <TableCell>{item.equipmentId || "-"}</TableCell>
                        <TableCell>{eq?.name || "-"}</TableCell>
                        <TableCell>{item.maintenanceCount ?? 0}</TableCell>
                        <TableCell>{item.lastMaintenanceDate ? dayjs(item.lastMaintenanceDate).format("YYYY-MM-DD") : "-"}</TableCell>
                        <TableCell>{item.nextMaintenanceDate ? dayjs(item.nextMaintenanceDate).format("YYYY-MM-DD") : "-"}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.status}
                            color={
                              item.status === "Functional" ? "success" :
                                item.status === "Scheduled" ? "info" :
                                  item.status === "Under Maintenance" ? "warning" :
                                    "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{item.mainteneceDoneBy || "-"}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            {item.status === "Scheduled" && (
                              <>
                                <Tooltip title="Acquire for Maintenance">
                                  <Button variant="outlined" size="small" onClick={() => handleAcquireForMaintenance(item)}>
                                    Acquire
                                  </Button>
                                </Tooltip>
                                {/* <Tooltip title="Mark Complete">
                                  <IconButton color="success" onClick={() => openCompleteDialog(item)}>
                                    <AssignmentTurnedIn />
                                  </IconButton>
                                </Tooltip> */}
                                {/* <Tooltip title="Reserve Usage">
                                  <IconButton color="info" onClick={() => openReserveDialog(item)}>
                                    <EventAvailable />
                                  </IconButton>
                                </Tooltip> */}
                              </>
                            )}
                            {(item.status === "Under Maintenance" || item.status === "Functional") && (
                              <>
                              {/* <Tooltip title="Schedule Maintenance">
                                <IconButton color="primary" onClick={() => openScheduleDialog(item)}>
                                  <Assignment />
                                </IconButton>
                              </Tooltip> */}
                               <Tooltip title="Mark Complete">
                                  <IconButton color="success" onClick={() => openCompleteDialog(item)}>
                                    <AssignmentTurnedIn />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="View Report / Export PDF">
                              <IconButton color="secondary" onClick={() => openReportDialog(item)}>
                                <PictureAsPdf />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Box>
          {filteredRecords.length > rowsPerPage && (
            <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" showFirstButton showLastButton shape="rounded" />
            </Box>
          )}
        </Paper>
      )}

      {/* Calendar Dialog */}
      <Dialog open={calendarOpen} onClose={() => setCalendarOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <EventIcon sx={{ mb: "-4px", mr: 1 }} /> Maintenance Calendar
        </DialogTitle>
        <DialogContent dividers sx={{ height: 600, p: 0 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            date={calendarDate}
            view={calendarView}
            onView={(v) => {
              console.debug("Calendar View Changed:", v);
              setCalendarView(v);
            }}
            onNavigate={(d, v) => {
              console.debug("Calendar Navigated:", d, v);
              setCalendarDate(d);
              if (v && v !== calendarView) setCalendarView(v);
            }}
            startAccessor="start"
            endAccessor="end"
            tooltipAccessor={(event) => event.title}
            views={["month", "week", "day"]}
            style={{ height: 540 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCalendarOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance Dialog */}
      <Dialog open={dialogOpen} onClose={closeAllDialogs} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle>{isCompleteMode ? "Mark Maintenance Complete" : "Schedule Maintenance"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Equipment ID" value={formData.equipmentId || "-"} disabled fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Equipment Name" value={formData.equipmentName || "-"} disabled fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Maintenance Count" value={formData.maintenanceCount || 0} disabled fullWidth />
            </Grid>
            {isCompleteMode && (
              <Grid item xs={6}>
                <TextField
                  label="Next Maintenance Date"
                  name="nextMaintenanceDate"
                  type="date"
                  value={formData.nextMaintenanceDate || ""}
                  // onChange={(e) => setFormData((p) => ({ ...p, nextMaintenanceDate: e.target.value }))}
                   onChange={handleFormChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            {!isCompleteMode && (
              <Grid item xs={6}>
                <TextField
                  label="Status"
                  name="status"
                  select
                  value={formData.status}
                  onChange={handleFormChange}
                  fullWidth
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {isCompleteMode && (
              <Grid item xs={6}>
                <TextField
                  label="Maintenance Cost"
                  name="maintenanceCost"
                  type="number"
                  value={formData.maintenanceCost}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField label="Remarks" name="remarks" multiline rows={3} value={formData.remarks} onChange={handleFormChange} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAllDialogs}>Cancel</Button>
          {isCompleteMode ? (
            <Button variant="contained" color="success" onClick={handleComplete}>
              Mark as Completed
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSchedule}>
              Schedule
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Reserve Dialog */}
      <Dialog open={reserveDialogOpen} onClose={closeAllDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Reserve Usage</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Reserved By"
            value={currentUser?.employeeId || ""}
            disabled
            fullWidth
            margin="dense"
            name="reservedBy"
            id="reservedBy"
          />
          <TextField
            label="Usage Start"
            name="usageStart"
            id="usageStart"
            type="date"
            value={reserveForm.usageStart}
            onChange={handleReserveChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Usage End"
            name="usageEnd"
            id="usageEnd"
            type="date"
            value={reserveForm.usageEnd}
            onChange={handleReserveChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Purpose"
            name="purpose"
            id="purpose"
            multiline
            rows={3}
            value={reserveForm.purpose}
            onChange={handleReserveChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAllDialogs}>Cancel</Button>
          <Button variant="contained" onClick={handleReserveSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
       <Dialog open={reportDialogOpen} onClose={closeAllDialogs} maxWidth="md" fullWidth>
         <DialogTitle>Equipment Lifecycle Report</DialogTitle>
         <DialogContent dividers>
           {selectedRecord && (
            <>
              <Typography>Equipment ID: {selectedRecord.equipmentId}</Typography>
              <Typography>
                Equipment Name: {equipmentMap[selectedRecord.equipmentId]?.name || "-"}
              </Typography>
              <Typography>Status: {selectedRecord.status}</Typography>
              <Typography>
                Maintained By: {selectedRecord.mainteneceDoneBy || "-"}
              </Typography>
              <Typography>
                Maintenance Count: {selectedRecord.maintenanceCount ?? 0}
              </Typography>
              <Typography>
                Last Maintenance:{" "}
                {selectedRecord.lastMaintenanceDate
                  ? dayjs(selectedRecord.lastMaintenanceDate).format("YYYY-MM-DD")
                  : "-"}
              </Typography>
              <Typography>
                Next Maintenance:{" "}
                {selectedRecord.nextMaintenanceDate
                  ? dayjs(selectedRecord.nextMaintenanceDate).format("YYYY-MM-DD")
                  : "-"}
              </Typography>
              <Typography>Remarks: {selectedRecord.purpose || "-"}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAllDialogs}>Close</Button>
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={generatePDFReport}
          >
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
