import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  Toolbar, 
  createTheme,
  CircularProgress,
  Snackbar,
  Alert
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
import VendorEquipmentDialog from '../ProcurementDashboard/VendorEquipmentDialog';
import { 
  EQUIPMENT_ENDPOINTS, 
  VENDOR_ENDPOINTS, 
  PURCHASE_ORDER_ENDPOINTS,
  STOCK_LEVEL_ENDPOINTS,
  PURCHASE_ORDER_ITEM_ENDPOINTS,
  NOTIFICATION_ENDPOINTS
} from '../../API_ENDPOINTS/API'
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export default function ProcurementDashboard() {
  const [mode, setMode] = useState('light');
  const [collapsed, setCollapsed] = useState(false);
  const [nav, setNav] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Data states
  const [equipment, setEquipment] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
  
  // Form states
  const [equipmentDialog, setEquipmentDialog] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [vendorDialog, setVendorDialog] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [vendorEquipmentDialog, setVendorEquipmentDialog] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [orderDialog, setOrderDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Search/filter states
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [equipmentFilters, setEquipmentFilters] = useState({
    category: '',
    status: ''
  });
  const [vendorSearch, setVendorSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [alertSearch, setAlertSearch] = useState('');

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
  });

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        equipRes, 
        vendorRes, 
        orderRes, 
        alertRes,
        notificationRes
      ] = await Promise.all([
        axios.get(EQUIPMENT_ENDPOINTS.GET_ALL),
        axios.get(VENDOR_ENDPOINTS.GET_ALL),
        axios.get(PURCHASE_ORDER_ENDPOINTS.GET_ALL),
        axios.get(STOCK_LEVEL_ENDPOINTS.BELOW_MINIMUM),
        axios.get(NOTIFICATION_ENDPOINTS.GET_ALL)
      ]);

      // Fetch order items for each purchase order
      const ordersWithItems = await Promise.all(
        orderRes.data.map(async order => {
          const itemsRes = await axios.get(PURCHASE_ORDER_ITEM_ENDPOINTS.GET_BY_PO_ID(order._id));
          return {
            ...order,
            items: itemsRes.data,
            vendorName: vendorRes.data.find(v => v._id === order.vendorId)?.name || ''
          };
        })
      );

      setEquipment(equipRes.data);
      setVendors(vendorRes.data);
      setOrders(ordersWithItems);
      setAlerts(alertRes.data);
      setNotifications(notificationRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
      showSnackbar('Failed to load data', 'error');
    }
  };

  useEffect(() => {
    fetchData();

  }, []);

    useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      // Optionally decode token to get user id/email/role
      const decoded = jwtDecode(token);
      // For example: decoded.email or decoded.sub (subject)
      const userEmail = decoded.sub || decoded.email;

      // Make an API call to get current user based on token
      axios.get('http://localhost:9090/Login-Auth-MS/api/auth/current', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if(res.data.roleName === 'Procurement Officer') {
          setCurrentUser(res.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch current user', err);
        // Optionally handle logout or token invalidation here
      });
    } catch (err) {
      console.error('Invalid token', err);
      // Optionally handle invalid token (logout user)
    }

  }, []);

  // Handle equipment operations
  const handleEquipmentSave = async (data) => {
    try {
      const promise = currentEquipment 
        ? axios.put(EQUIPMENT_ENDPOINTS.UPDATE(currentEquipment._id), data)
        : axios.post(EQUIPMENT_ENDPOINTS.CREATE, data);
      
      await promise;
      await fetchData();
      setEquipmentDialog(false);
      setCurrentEquipment(null);
      showSnackbar(`Equipment ${currentEquipment ? 'updated' : 'created'} successfully`);
    } catch (err) {
      console.error('Error saving equipment:', err);
      showSnackbar(`Failed to ${currentEquipment ? 'update' : 'create'} equipment`, 'error');
    }
  };

  const handleEquipmentDelete = async (id) => {
    try {
      await axios.delete(EQUIPMENT_ENDPOINTS.DELETE(id));
      await fetchData();
      showSnackbar('Equipment deleted successfully');
    } catch (err) {
      console.error('Error deleting equipment:', err);
      showSnackbar('Failed to delete equipment', 'error');
    }
  };

  // Handle vendor operations
  const handleVendorSave = async (data) => {
    try {
      const promise = currentVendor 
        ? axios.put(VENDOR_ENDPOINTS.UPDATE(currentVendor._id), data)
        : axios.post(VENDOR_ENDPOINTS.CREATE, data);
      
      await promise;
      await fetchData();
      setVendorDialog(false);
      setCurrentVendor(null);
      showSnackbar(`Vendor ${currentVendor ? 'updated' : 'created'} successfully`);
    } catch (err) {
      console.error('Error saving vendor:', err);
      showSnackbar(`Failed to ${currentVendor ? 'update' : 'create'} vendor`, 'error');
    }
  };

  const handleVendorDelete = async (id) => {
    try {
      await axios.delete(VENDOR_ENDPOINTS.DELETE(id));
      await fetchData();
      showSnackbar('Vendor deleted successfully');
    } catch (err) {
      console.error('Error deleting vendor:', err);
      showSnackbar('Failed to delete vendor', 'error');
    }
  };

  // Handle vendor-equipment relationship
  const handleLinkEquipment = (vendorId) => {
    setSelectedVendorId(vendorId);
    setVendorEquipmentDialog(true);
  };

  const handleAddEquipmentToVendor = async (vendorId, equipmentId) => {
    try {
      await axios.post(VENDOR_ENDPOINTS.ADD_EQUIPMENT_TO_VENDOR(vendorId, equipmentId));
      await fetchData();
      showSnackbar('Equipment added to vendor successfully');
    } catch (err) {
      console.error('Error adding equipment to vendor:', err);
      showSnackbar('Failed to add equipment to vendor', 'error');
    }
  };

  const handleRemoveEquipmentFromVendor = async (vendorId, equipmentId) => {
    try {
      await axios.post(VENDOR_ENDPOINTS.REMOVE_EQUIPMENT_FROM_VENDOR(vendorId, equipmentId));
      await fetchData();
      showSnackbar('Equipment removed from vendor successfully');
    } catch (err) {
      console.error('Error removing equipment from vendor:', err);
      showSnackbar('Failed to remove equipment from vendor', 'error');
    }
  };

  // Handle order operations
  const handleOrderSave = async (data) => {
    try {
      // First save the order
      const orderPromise = currentOrder 
        ? axios.put(PURCHASE_ORDER_ENDPOINTS.UPDATE(currentOrder.id||currentOrder._id), data)
        : axios.post(PURCHASE_ORDER_ENDPOINTS.CREATE, data);
      
      const orderRes = await orderPromise;
      const orderId = orderRes.data?._id || currentOrder?._id||orderRes.data?.id || currentOrder?.id;

      if (!orderId) {
        throw new Error('Failed to get order ID');
      }

      // Process items
      const itemsToProcess = data.items.filter(item => 
        item && item.equipmentId && item.quantity > 0
      );

      // Save/update items
      await Promise.all(
        itemsToProcess.map(item => {
          const itemData = {
            poId: orderId,
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            total: (item.quantity || 0) * (item.unitPrice || 0)
          };
          
          return item._id 
            ? axios.put(PURCHASE_ORDER_ITEM_ENDPOINTS.UPDATE(item._id||item.id), itemData)
            : axios.post(PURCHASE_ORDER_ITEM_ENDPOINTS.CREATE, itemData);
        })
      );

      // Delete any removed items if editing
      if (currentOrder && Array.isArray(currentOrder.items)) {
        const currentItemIds = currentOrder.items.map(i => i._id||i.id).filter(Boolean);
        const newItemIds = itemsToProcess.map(i => i._id||i.id).filter(Boolean);
        const itemsToDelete = currentItemIds.filter(id => !newItemIds.includes(id));
        
        await Promise.all(
          itemsToDelete.map(id => 
            axios.delete(PURCHASE_ORDER_ITEM_ENDPOINTS.DELETE(id))
          )
        );
      }

      await fetchData();
      setOrderDialog(false);
      setCurrentOrder(null);
      showSnackbar(`Order ${currentOrder ? 'updated' : 'created'} successfully`);
    } catch (err) {
      console.error('Error saving order:', err);
      showSnackbar(`Failed to ${currentOrder ? 'update' : 'create'} order`, 'error');
    }
  };

  // Handle reorder from alerts
  const handleReorder = (equipmentId) => {
    const equipmentToOrder = equipment.find(e => e._id === equipmentId);
    if (!equipmentToOrder) return;

    setCurrentOrder({
      poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      vendorId: equipmentToOrder.vendorId,
      dateIssued: new Date(),
      status: 'Pending',
      items: [{
        equipmentId: equipmentToOrder._id,
        equipmentName: equipmentToOrder.name,
        quantity: 1,
        unitPrice: 0,
        total: 0
      }],
      totalAmount: 0
    });
    setOrderDialog(true);
    setNav('orders');
  };

  // Get vendor's equipment list
  const getVendorEquipment = (vendorId) => {
    const vendor = vendors.find(v => v._id === vendorId);
    if (!vendor || !vendor.equipmentProvided) return [];
    
    return vendor.equipmentProvided.map(equipId => 
      equipment.find(e => e._id === equipId)
    ).filter(Boolean);
  };

  // Content switching
  let content;
  if (loading) {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else if (error) {
    content = (
      <Box sx={{ p: 3, color: 'error.main' }}>
        Error loading data: {error}
      </Box>
    );
  } else {
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
              onDelete={handleEquipmentDelete}
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
              onSave={handleEquipmentSave}
              equipment={currentEquipment}
              vendors={vendors}
            />
          </>
        );
        break;
      case 'vendors':
        content = (
          <>
            <VendorTable
              vendors={vendors}
              onEdit={(vendor) => {
                setCurrentVendor(vendor);
                setVendorDialog(true);
              }}
              onDelete={handleVendorDelete}
              onLinkEquipment={handleLinkEquipment}
              search={vendorSearch}
              onSearch={setVendorSearch}
            />
            <VendorForm
              open={vendorDialog}
              onClose={() => {
                setVendorDialog(false);
                setCurrentVendor(null);
              }}
              onSave={handleVendorSave}
              vendor={currentVendor}
              equipmentList={equipment}
            />
            <VendorEquipmentDialog
              open={vendorEquipmentDialog}
              onClose={() => setVendorEquipmentDialog(false)}
              vendorId={selectedVendorId}
              vendorName={vendors.find(v => v._id === selectedVendorId)?.name || ''}
              equipmentList={selectedVendorId ? getVendorEquipment(selectedVendorId) : []}
              allEquipment={equipment}
              onAddEquipment={handleAddEquipmentToVendor}
              onRemoveEquipment={handleRemoveEquipmentFromVendor}
            />
          </>
        );
        break;
      case 'orders':
        case 'purchase-orders':
          content = (
            <>
              <PurchaseOrderTable
                orders={orders}
                onEdit={(order) => {
                  setCurrentOrder(order);
                  setOrderDialog(true);
                }}
                onView={(id) => {
                  const order = orders.find(o => o._id === id);
                  if (order) {
                    setCurrentOrder(order);
                    setOrderDialog(true);
                  }
                }}
                search={orderSearch}
                onSearch={setOrderSearch}
              />
              <PurchaseOrderForm
                open={orderDialog}
                onClose={() => {
                  setOrderDialog(false);
                  setCurrentOrder(null);
                }}
                onSave={handleOrderSave}
                order={currentOrder}
                vendors={vendors}
                equipment={equipment}
                notifications={notifications.filter(n => 
                  n.notificationType === 'ORDER' && 
                  n.recipientId === currentOrder?._id
                )}
              />
            </>
          );
          break;
      case 'alerts':
      case 'stock-alerts':
        content = (
          <StockAlertTable
            alerts={alerts}
            onReorder={handleReorder}
            search={alertSearch}
            onSearch={setAlertSearch}
          />
        );
        break;
      default:
        content = <Box sx={{ p: 3 }}>Select a section</Box>;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}>
        <ProcurementSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          selected={nav}
          onSelect={setNav}
        />
        <Box 
          component="main"
          sx={{ 
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${collapsed ? 40 : 600}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ml: `${collapsed ? 40 : 60}px`
          }}
        >
          <ProcurementAppBar 
            title={nav}
            mode={mode}
            onToggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')}
            onToggleSidebar={() => setCollapsed(!collapsed)}
            user={currentUser}
          />
          <Toolbar />
          {content}

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </ThemeProvider>
  );
}