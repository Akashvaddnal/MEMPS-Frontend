import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Login/Login"; 
import SystemAdminDashboard from "./SystemAdminDashboard/SystemAdminDashboard";
import ProcurementDashboard from "../src/Procurement-Officer-Dashboard/pages/ProcurementDashboard";
import InventoryManagerDashboard from "./Inventory-Manager-Dashboard/InventoryManagerDashboard";
import HospitalStaffDashboard from "./Hospital-Staff-Dashboard/Hospital-Staff-Dashboard-App";
import BiomedicalEngineerDashboard from "./BioMedial-And-Clinical-Engineers/Biomedicla-Engineer-Dashboard";


export default function App() {
  return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/System-dashboard" element={<SystemAdminDashboard />} />
            <Route path="/procurement-dashboard" element={<ProcurementDashboard />} />
            <Route path="/inventory-dashboard/*" element={<InventoryManagerDashboard />} />
            <Route path="/hospital-staff-dashboard/*" element={<HospitalStaffDashboard />} />
            <Route path="/biomedical-engineer-dashboard/*" element={<BiomedicalEngineerDashboard />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </BrowserRouter>
    
  );
}
