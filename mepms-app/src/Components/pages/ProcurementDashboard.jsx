import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import ProcurementSidebar from '../ProcurementDashboard/ProcurementSidebar';
import DashboardSummary from '../ProcurementDashboard/DashboardSummary';
import EquipmentTable from '../ProcurementDashboard/EquipmentTable';
import EquipmentForm from '../ProcurementDashboard/EquipmentForm';
import VendorTable from '../ProcurementDashboard/VendorTable';
import VendorForm from '../ProcurementDashboard/VendorForm';
import PurchaseOrderTable from '../ProcurementDashboard/PurchaseOrderTable';
import PurchaseOrderForm from '../ProcurementDashboard/PurchaseOrderForm';
import StockAlertTable from '../ProcurementDashboard/StockAlertTable';
import ProcurementAppBar from '../ProcurementDashboard/ProcurementAppBar';
import { 
  EQUIPMENT_ENDPOINTS, 
  VENDOR_ENDPOINTS, 
  PURCHASE_ORDER_ENDPOINTS,
  STOCK_LEVEL_ENDPOINTS
} from '../API_ENDPOINTS';
import axios from 'axios';

export default function ProcurementDashboard() {
  const [mode, setMode] = useState('light');
  const [mini, setMini] = useState(false);
  const [nav, setNav] = useState('dashboard');
  
  // Data states
  const [equipment, setEquipment] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Form states
  const [equipmentDialog, setEquipmentDialog] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  
  // Search/filter states
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [equipmentFilters, setEquipmentFilters] = useState({
    category: '',
    status: ''
  });

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
    },
  });

  // Fetch data
  useEffect(() => {
    axios.get(EQUIPMENT_ENDPOINTS.GET_ALL).then(res => setEquipment(res.data));
    axios.get(VENDOR_ENDPOINTS.GET_ALL).then(res => setVendors(res.data));
    axios.get(PURCHASE_ORDER_ENDPOINTS.GET_ALL).then(res => setOrders(res.data));
    axios.get(STOCK_LEVEL_ENDPOINTS.BELOW_MINIMUM).then(res => setAlerts(res.data));
  }, []);

  // Content switching
  let content;
  switch (nav) {
    case 'dashboard':
      content = (
        <DashboardSummary 
          equipmentCount={equipment.length} 
          vendorCount={vendors.length}
          orderCount={orders.length}
          alertCount={alerts.length}
        />
      );
      break;
    case 'equipment':
      content = (
        <>
          <EquipmentTable
            equipment={equipment}
            onEdit={(item) => {
              setCurrentEquipment(item);
              setEquipmentDialog(true);
            }}
            onDelete={(id) => {
              axios.delete(EQUIPMENT_ENDPOINTS.DELETE(id))
                .then(() => axios.get(EQUIPMENT_ENDPOINTS.GET_ALL))
                .then(res => setEquipment(res.data));
            }}
            search={equipmentSearch}
            onSearch={setEquipmentSearch}
            filters={equipmentFilters}
            onFilter={setEquipmentFilters}
          />
          <EquipmentForm
            open={equipmentDialog}
            onClose={() => {
              setEquipmentDialog(false);
              setCurrentEquipment(null);
            }}
            onSave={(data) => {
              const promise = currentEquipment 
                ? axios.put(EQUIPMENT_ENDPOINTS.UPDATE(currentEquipment.id), data)
                : axios.post(EQUIPMENT_ENDPOINTS.CREATE, data);
              
              promise
                .then(() => axios.get(EQUIPMENT_ENDPOINTS.GET_ALL))
                .then(res => {
                  setEquipment(res.data);
                  setEquipmentDialog(false);
                  setCurrentEquipment(null);
                });
            }}
            equipment={currentEquipment}
          />
        </>
      );
      break;
    // Add cases for other navigation items
    default:
      content = <Box sx={{ p: 3 }}>Select a section</Box>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <ProcurementSidebar 
          mini={mini} 
          selected={nav} 
          onSelect={setNav} 
          onMiniToggle={() => setMini(!mini)} 
        />
        <Box sx={{ flexGrow: 1, ml: mini ? '64px' : '220px' }}>
          <ProcurementAppBar 
            title={nav}
            mode={mode}
            onToggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')}
            onToggleSidebar={() => setMini(!mini)}
          />
          <Box component="main" sx={{ p: 3 }}>
            {content}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}