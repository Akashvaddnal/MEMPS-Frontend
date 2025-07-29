import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Autocomplete,
  Stack,
} from "@mui/material";
import axios from "axios";
import { DEPARTMENT_ENDPOINTS, EQUIPMENT_ENDPOINTS } from "../../api/endpoints";

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [equipments, setEquipments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactPerson: "",
    phone: "",
    email: "",
  });

  // Assign equipment dialog
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Filters
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchName) params.name = searchName;
      if (searchLocation) params.location = searchLocation;
      const response = await axios.get(DEPARTMENT_ENDPOINTS.GET_ALL, { params });
      setDepartments(response.data);
    } catch (error) {
      alert("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      const response = await axios.get(EQUIPMENT_ENDPOINTS.GET_ALL);
      setEquipments(response.data || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [searchName, searchLocation]);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Department Dialog handlers
  const openNewDialog = () => {
    setFormData({
      name: "",
      location: "",
      contactPerson: "",
      phone: "",
      email: "",
    });
    setEditingDept(null);
    setDialogOpen(true);
  };

  const openEditDialog = (dept) => {
    setFormData({
      name: dept.name || "",
      location: dept.location || "",
      contactPerson: dept.contactPerson || "",
      phone: dept.phone || "",
      email: dept.email || "",
    });
    setEditingDept(dept);
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editingDept) {
        await axios.put(DEPARTMENT_ENDPOINTS.UPDATE(editingDept.id), formData);
      } else {
        await axios.post(DEPARTMENT_ENDPOINTS.CREATE, formData);
      }
      fetchDepartments();
      closeDialog();
    } catch {
      alert("Failed to save department");
    }
  };

  const handleDelete = async (deptId) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await axios.delete(DEPARTMENT_ENDPOINTS.DELETE(deptId));
      fetchDepartments();
    } catch {
      alert("Failed to delete department");
    }
  };

  // Equipment assignment dialog handlers
  const openAssignDialog = (department) => {
    setSelectedDepartment(department);
    setSelectedEquipment(null);
    setAssignDialogOpen(true);
  };
  const closeAssignDialog = () => setAssignDialogOpen(false);

  const handleAssignEquipmentChange = (event, value) => {
    setSelectedEquipment(value);
  };

  // Assign equipment to department with stock check
  const handleAssignEquipment = async () => {
    if (!selectedDepartment || !selectedEquipment) {
      alert("Select department and equipment");
      return;
    }
    try {
      await axios.post(
        DEPARTMENT_ENDPOINTS.ASSIGN_EQUIPMENT(selectedDepartment.id, selectedEquipment.id)
      );
      alert("Equipment assigned successfully");
      setAssignDialogOpen(false);
      fetchDepartments();
      fetchEquipments();  // refresh to get updated stocks (optional)
    } catch (err) {
      const message = err.response?.data?.error || "Failed to assign equipment";
      alert(message);
    }
  };

  // Filter input handlers
  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };
  const handleSearchLocationChange = (e) => {
    setSearchLocation(e.target.value);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Department Management
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search Department Name"
          size="small"
          value={searchName}
          onChange={handleSearchNameChange}
        />
        <TextField
          label="Search Location"
          size="small"
          value={searchLocation}
          onChange={handleSearchLocationChange}
        />
      </Stack>

      <Button variant="contained" sx={{ mb: 2 }} onClick={openNewDialog}>
        Add Department
      </Button>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ maxHeight: 540 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Equipment Inventory</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No departments found
                    </TableCell>
                  </TableRow>
                )}
                {departments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dept) => (
                    <TableRow key={dept.id || dept._id}>
                      <TableCell>{dept.name}</TableCell>
                      <TableCell>{dept.location}</TableCell>
                      <TableCell>{dept.contactPerson}</TableCell>
                      <TableCell>{dept.phone}</TableCell>
                      <TableCell>{dept.email}</TableCell>
                      <TableCell>
                        {dept.equipmentInventory
                          ? Object.entries(dept.equipmentInventory).map(([eqId, count]) => (
                              <div key={eqId}>
                                {eqId}: {count}
                              </div>
                            ))
                          : "No equipment"}
                      </TableCell>
                      <TableCell align="center">
                        <Button size="small" onClick={() => openEditDialog(dept)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(dept.id || dept._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                          onClick={() => openAssignDialog(dept)}
                        >
                          Assign Equipment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={departments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Department Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDept ? "Edit Department" : "Add Department"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Location"
            name="location"
            fullWidth
            margin="dense"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="Contact Person"
            name="contactPerson"
            fullWidth
            margin="dense"
            value={formData.contactPerson}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="dense"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="dense"
            value={formData.email}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDept ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Equipment Dialog */}
      <Dialog open={assignDialogOpen} onClose={closeAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Assign Equipment to {selectedDepartment?.name || "Department"}
        </DialogTitle>
        <DialogContent dividers>
          <Autocomplete
            options={equipments}
            getOptionLabel={(option) => `${option.name} (${option.id || option._id})`}
            onChange={handleAssignEquipmentChange}
            value={selectedEquipment}
            renderInput={(params) => (
              <TextField {...params} label="Select Equipment" margin="dense" fullWidth />
            )}
            filterSelectedOptions
          />
          <Typography variant="caption" mt={1} display="block">
            * Equipment availability checked on assign. Stock will be decreased automatically.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAssignDialog}>Cancel</Button>
          <Button onClick={handleAssignEquipment} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentTable;
