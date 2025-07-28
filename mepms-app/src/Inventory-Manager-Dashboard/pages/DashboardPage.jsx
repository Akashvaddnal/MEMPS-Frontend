// src/pages/DashboardPage.jsx

import React, { useEffect, useState } from "react";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import { EQUIPMENT_ENDPOINTS } from "../api/endpoints";
import EquipmentCard from "../components/dashboard/EquipmentCard";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";
import InventoryAuditTable from "../components/dashboard/InventoryAuditTable";
import EquipmentLifeCycleTable from "../components/dashboard/EquipmentLifeCycleTable";
import EquipmentUsageTable from "../components/dashboard/EquipmentUsageTable";
import MaintenanceRequestTable from "../components/dashboard/MaintenanceRequestTable";
import StockLevelsTable from "../components/dashboard/StockLevelsTable";

const DashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loadingEquipments, setLoadingEquipments] = useState(false);

  useEffect(() => {
    setLoadingEquipments(true);
    axios
      .get(EQUIPMENT_ENDPOINTS.GET_ALL)
      .then((res) => setEquipmentList(res.data || []))
      .catch(() => setEquipmentList([]))
      .finally(() => setLoadingEquipments(false));
  }, []);

  const deleteEquipment = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await axios.delete(EQUIPMENT_ENDPOINTS.DELETE(id));
      setEquipmentList((prev) => prev.filter((eq) => eq.id !== id));
    } catch {
      alert("Failed to delete equipment");
    }
  };

  const updateEquipment = (updatedEquip) => {
    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === updatedEquip.id ? updatedEquip : eq))
    );
  };

  const handleTabChange = (e, newVal) => {
    setSelectedTab(newVal);
  };

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        <Tab label="Equipment" />
        <Tab label="Equipment Lifecycle" />
        <Tab label="Equipment Usage" />
        <Tab label="Inventory Audits" />
        <Tab label="Maintenance Requests" />
        <Tab label="Stock Levels" />
        <Tab label="Analytics" />
      </Tabs>

      {selectedTab === 0 && (
        <>
          {loadingEquipments && <Typography>Loading Equipments...</Typography>}
          {!loadingEquipments && equipmentList.length === 0 && (
            <Typography>No equipment found.</Typography>
          )}
          <Grid container spacing={2}>
            {equipmentList.map((equipment) => (
              <Grid item key={equipment.id} xs={12} sm={6} md={4} lg={3}>
                <EquipmentCard
                  equipment={equipment}
                  onDelete={deleteEquipment}
                  onUpdate={updateEquipment}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {selectedTab === 1 && <EquipmentLifeCycleTable />}
      {selectedTab === 2 && <EquipmentUsageTable />}
      {selectedTab === 3 && <InventoryAuditTable />}
      {selectedTab === 4 && <MaintenanceRequestTable />}
      {selectedTab === 5 && <StockLevelsTable />}
      {selectedTab === 6 && <AnalyticsCharts />}
    </Box>
  );
};

export default DashboardPage;
