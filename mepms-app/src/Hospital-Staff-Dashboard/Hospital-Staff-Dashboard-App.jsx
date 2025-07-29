// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import ThemeProvider from "./Components/layout/ThemeProvider";
// import HospitalStaffDashboardPage from "./pages/HospitalStaffDashboardPage";
// import MaintenanceRequestPage from "./pages/MaintenanceRequestPage";
// import EquipmentUsageRequestPage from "./pages/EquipmentUsageRequestPage";
// import StaffDashboardLayout from "./Components/layout/StaffDashboardLayout";
// import Dashboard from "./Components/dashboard/Dashboard";
// import MaintenanceRequests from "./Components/dashboard/MaintenanceRequests";
// import EquipmentListPage from "./Components/dashboard/EquipmentListPage";
// import SettingsPage from "./Components/dashboard/SettingsPage";

// const HospitalStaffDashboard = () => {
//   return (
//     <ThemeProvider>
      
//        <Routes>
//       {/* ... Other routes ... */}
//       <Route path="/hospital-staff-dashboard" element={<StaffDashboardLayout />}>
//         <Route index element={<Dashboard />} />
//         <Route path="maintenance-requests" element={<MaintenanceRequestPage />} />
//         <Route path="usage-requests" element={<EquipmentUsageRequestPage />} />
//         <Route path="equipment" element={<EquipmentListPage />} />
//         <Route path="settings" element={<SettingsPage />} />
//         <Route path="*" element={<Navigate to="/hospital-staff-dashboard" />} />
//       </Route>
//       {/* ... Other routes ... */}
//     </Routes>
      
//     </ThemeProvider>
//   );
// };

// export default HospitalStaffDashboard;


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StaffDashboardLayout from "./Components/layout/StaffDashboardLayout";
import Dashboard from "./Components/dashboard/Dashboard";
import EquipmentListPage from "./Components/dashboard/EquipmentListPage";
import MaintenanceRequestPage from "./pages/MaintenanceRequestPage";
import EquipmentUsageRequestPage from "./pages/EquipmentUsageRequestPage";
import SettingsPage from "./Components/dashboard/SettingsPage";
import ThemeProvider from "./Components/layout/ThemeProvider";
import HospitalStaffDashboardPage from "./pages/HospitalStaffDashboardPage";

const HospitalStaffDashboard = () => {
  return (
    <ThemeProvider>
    <Routes>
      <Route path="/" element={<StaffDashboardLayout />}>
        <Route index element={<HospitalStaffDashboardPage />} />
        <Route path="maintenance-requests" element={<MaintenanceRequestPage />} />
        <Route path="usage-requests" element={<EquipmentUsageRequestPage />} />
        <Route path="equipment" element={<EquipmentListPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
    </ThemeProvider>
  );
};

export default HospitalStaffDashboard;
