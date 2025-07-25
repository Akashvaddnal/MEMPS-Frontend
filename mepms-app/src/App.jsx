import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Login/Login"; 
import SystemAdminDashboard from "./SystemAdminDashboard/SystemAdminDashboard";
import AdminDashboard from "../src/System-Admin/AdminDashboard";
import ClinicianDashboard from "../src/System-Admin/SystemAdminDashboard";
import ProcurementDashboard from "../src/Components/pages/ProcurementDashboard";

export default function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<SystemAdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/procurement-dashboard" element={<ProcurementDashboard />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
