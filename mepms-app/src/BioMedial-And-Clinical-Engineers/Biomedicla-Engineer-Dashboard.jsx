// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import BiomedicalStaffDashboard from "./pages/BiomedicalStaffDashboardPage";
// import ThemeProvider from "./components/layout/ThemeProvider";
// import BiomedicalStaffDashboardPage from "./pages/BiomedicalStaffDashboardPage";
// import Dashboard from "./components/dashboard/Dashboard";
// import MaintenanceRequests from "./components/dashboard/MaintenanceRequests";
// import EquipmentLifeCycle from "./components/dashboard/EquipmentLifeCycle";
// export default function BiomedicalEngineerDashboard() {
//   return (
//     <ThemeProvider>
      
//         {/* <Routes>
//           <Route path="biomedical/*" element={<BiomedicalStaffDashboardPage />} />
//           <Route path="*" element={<Navigate to="/biomedical" replace />} />
//         </Routes> */}
//         <Routes>
//           <Route path="/biomedical" element={<BiomedicalStaffDashboardPage />}>
//             {/* All child routes below are rendered INSIDE your StaffDashboardLayout's <Outlet /> */}
//             <Route index element={<Dashboard />} />
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="maintenance-requests" element={<MaintenanceRequests />} />
//             <Route path="equipment-life-cycle" element={<EquipmentLifeCycle />} />
//             {/* ...any additional pages */}
//             <Route path="*" element={<Navigate to="/biomedical/dashboard" />} />
//           </Route>
//           <Route path="*" element={<Navigate to="/biomedical/dashboard" />} />
//         </Routes>

      
//     </ThemeProvider>
//   );
// }



import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ThemeProvider from "./components/layout/ThemeProvider";
import BiomedicalStaffDashboardPage from "./pages/BiomedicalStaffDashboardPage";
import Dashboard from "./components/dashboard/Dashboard";
import MaintenanceRequests from "./components/dashboard/MaintenanceRequests";
import EquipmentLifeCycle from "./components/dashboard/EquipmentLifeCycle";
import { fetchCurrentUser } from "./utils/auth";
import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import EquipmentListPage from "./components/dashboard/EquipmentListPage";


export default function BiomedicalEngineerDashboard() {
const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      setCurrentUser(await fetchCurrentUser());
      setLoadingUser(false);
    }
    loadUser();
  }, []);

  if (loadingUser) {
    return <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>;
  }
  if (!currentUser) {
    return <Box sx={{ m: 4 }}><p>Please login to access the dashboard</p></Box>;
  }


  return (
    <ThemeProvider>
      <Routes>
        {/* DO NOT use /biomedical here. Just the relatives. */}
        <Route element={<BiomedicalStaffDashboardPage />}>
          <Route index element={<Dashboard currentUser={currentUser} />} />
          <Route path="dashboard" element={<Dashboard currentUser={currentUser} />} />
          <Route path="maintenance-requests" element={<MaintenanceRequests currentUser={currentUser} />} />
          <Route path="equipment-life-cycle" element={<EquipmentLifeCycle currentUser={currentUser} />} />
          <Route path="equipment" element={<EquipmentListPage currentUser={currentUser} />} />
          {/* Additional pages as needed */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
