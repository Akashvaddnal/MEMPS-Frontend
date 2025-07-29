import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BiomedicalStaffDashboard from "./pages/BiomedicalStaffDashboardPage";
import ThemeProvider from "./components/layout/ThemeProvider";

export default function BiomedicalEngineerDashboard() {
  return (
    <ThemeProvider>
      
        <Routes>
          <Route path="/*" element={<BiomedicalStaffDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      
    </ThemeProvider>
  );
}
