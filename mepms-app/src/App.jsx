import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Box from '@mui/material/Box';
// import DashboardLayoutAccountSidebar from './System-Admin/SystemAdminDashboard';
// import AdminDashboard from './System-Admin/AdminDashboard';
import SystemAdminDashboard from './SystemAdminDashboard/SystemAdminDashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box sx={{ height: '100%', minHeight: '100vh', width: '100%', minWidth: 0 }}>
      {/* <DashboardLayoutAccountSidebar /> */}
      {/* <AdminDashboard/> */}
      <SystemAdminDashboard/>
    </Box>
  );
}

export default App
