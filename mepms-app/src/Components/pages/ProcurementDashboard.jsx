// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   CssBaseline, 
//   ThemeProvider, 
//   Toolbar, 
//   createTheme 
// } from '@mui/material';
// import ProcurementSidebar from '../ProcurementDashboard/ProcurementSidebar';
// import DashboardSummary from '../ProcurementDashboard/DashboardSummary';
// import EquipmentTable from '../ProcurementDashboard/EquipmentTable';
// import EquipmentForm from '../ProcurementDashboard/EquipmentForm';
// import VendorTable from '../ProcurementDashboard/VendorTable';
// import VendorForm from '../ProcurementDashboard/VendorForm';
// import PurchaseOrderTable from '../ProcurementDashboard/PurchaseOrderTable';
// import PurchaseOrderForm from '../ProcurementDashboard/PurchaseOrderForm';
// import StockAlertTable from '../ProcurementDashboard/StockAlertTable';
// import ProcurementAppBar from '../ProcurementDashboard/ProcurementAppBar';
// import { 
//   EQUIPMENT_ENDPOINTS, 
//   VENDOR_ENDPOINTS, 
//   PURCHASE_ORDER_ENDPOINTS,
//   STOCK_LEVEL_ENDPOINTS
// } from '../API_ENDPOINTS';
// import axios from 'axios';

// export default function ProcurementDashboard() {
//   const [mode, setMode] = useState('light');
//   const [collapsed, setCollapsed] = useState(false);
//   const [nav, setNav] = useState('dashboard');
  
//   // Data states
//   const [equipment, setEquipment] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [alerts, setAlerts] = useState([]);
  
//   // Form states
//   const [equipmentDialog, setEquipmentDialog] = useState(false);
//   const [currentEquipment, setCurrentEquipment] = useState(null);
//   const [vendorDialog, setVendorDialog] = useState(false);
//   const [currentVendor, setCurrentVendor] = useState(null);
//   const [orderDialog, setOrderDialog] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);

//   // Search/filter states
//   const [equipmentSearch, setEquipmentSearch] = useState('');
//   const [equipmentFilters, setEquipmentFilters] = useState({
//     category: '',
//     status: ''
//   });
//   const [vendorSearch, setVendorSearch] = useState('');
//   const [orderSearch, setOrderSearch] = useState('');
//   const [alertSearch, setAlertSearch] = useState('');

//   const theme = createTheme({
//     palette: {
//       mode,
//       primary: { main: '#1976d2' },
//       secondary: { main: '#9c27b0' },
//       background: {
//         default: mode === 'light' ? '#f5f5f5' : '#121212',
//         paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
//       },
//     },
//   });

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [equipRes, vendorRes, orderRes, alertRes] = await Promise.all([
//           axios.get(EQUIPMENT_ENDPOINTS.GET_ALL),
//           axios.get(VENDOR_ENDPOINTS.GET_ALL),
//           axios.get(PURCHASE_ORDER_ENDPOINTS.GET_ALL),
//           axios.get(STOCK_LEVEL_ENDPOINTS.BELOW_MINIMUM)
//         ]);
//         setEquipment(equipRes.data);
//         setVendors(vendorRes.data);
//         setOrders(orderRes.data);
//         setAlerts(alertRes.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   // Content switching
//   let content;
//   switch (nav) {
//     case 'dashboard':
//       content = (
//         <DashboardSummary 
//           equipmentCount={equipment.length} 
//           vendorCount={vendors.length}
//           orderCount={orders.length}
//           alertCount={alerts.length}
//         />
//       );
//       break;
//     case 'equipment':
//       content = (
//         <>
//           <EquipmentTable
//             equipment={equipment}
//             onEdit={(item) => {
//               setCurrentEquipment(item);
//               setEquipmentDialog(true);
//             }}
//             onDelete={(id) => {
//               axios.delete(EQUIPMENT_ENDPOINTS.DELETE(id))
//                 .then(() => axios.get(EQUIPMENT_ENDPOINTS.GET_ALL))
//                 .then(res => setEquipment(res.data));
//             }}
//             search={equipmentSearch}
//             onSearch={setEquipmentSearch}
//             filters={equipmentFilters}
//             onFilter={setEquipmentFilters}
//           />
//           <EquipmentForm
//             open={equipmentDialog}
//             onClose={() => {
//               setEquipmentDialog(false);
//               setCurrentEquipment(null);
//             }}
//             onSave={(data) => {
//               const promise = currentEquipment 
//                 ? axios.put(EQUIPMENT_ENDPOINTS.UPDATE(currentEquipment.id), data)
//                 : axios.post(EQUIPMENT_ENDPOINTS.CREATE, data);
              
//               promise
//                 .then(() => axios.get(EQUIPMENT_ENDPOINTS.GET_ALL))
//                 .then(res => {
//                   setEquipment(res.data);
//                   setEquipmentDialog(false);
//                   setCurrentEquipment(null);
//                 });
//             }}
//             equipment={currentEquipment}
//             vendors={vendors}
//           />
//         </>
//       );
//       break;
//     case 'vendors':
//       content = (
//         <>
//           <VendorTable
//             vendors={vendors}
//             onEdit={(vendor) => {
//               setCurrentVendor(vendor);
//               setVendorDialog(true);
//             }}
//             onDelete={(id) => {
//               axios.delete(VENDOR_ENDPOINTS.DELETE(id))
//                 .then(() => axios.get(VENDOR_ENDPOINTS.GET_ALL))
//                 .then(res => setVendors(res.data));
//             }}
//             search={vendorSearch}
//             onSearch={setVendorSearch}
//           />
//           <VendorForm
//             open={vendorDialog}
//             onClose={() => {
//               setVendorDialog(false);
//               setCurrentVendor(null);
//             }}
//             onSave={(data) => {
//               const promise = currentVendor 
//                 ? axios.put(VENDOR_ENDPOINTS.UPDATE(currentVendor.id), data)
//                 : axios.post(VENDOR_ENDPOINTS.CREATE, data);
              
//               promise
//                 .then(() => axios.get(VENDOR_ENDPOINTS.GET_ALL))
//                 .then(res => {
//                   setVendors(res.data);
//                   setVendorDialog(false);
//                   setCurrentVendor(null);
//                 });
//             }}
//             vendor={currentVendor}
//           />
//         </>
//       );
//       break;
//     case 'orders':
//       content = (
//         <>
//           <PurchaseOrderTable
//             orders={orders}
           
//             vendors={vendors}
//             onEdit={(order) => {
//               setCurrentOrder(order);
//               setOrderDialog(true);
//             }}
//             onView={(id) => {
//               // Handle view order details
//             }}
//             search={orderSearch}
//             onSearch={setOrderSearch}
//              equipment={equipment} 
//           />
//           <PurchaseOrderForm
//             open={orderDialog}
//             onClose={() => {
//               setOrderDialog(false);
//               setCurrentOrder(null);
//             }}
//             onSave={(data) => {
//               const promise = currentOrder 
//                 ? axios.put(PURCHASE_ORDER_ENDPOINTS.UPDATE(currentOrder.id), data)
//                 : axios.post(PURCHASE_ORDER_ENDPOINTS.CREATE, data);
              
//               promise
//                 .then(() => axios.get(PURCHASE_ORDER_ENDPOINTS.GET_ALL))
//                 .then(res => {
//                   setOrders(res.data);
//                   setOrderDialog(false);
//                   setCurrentOrder(null);
//                 });
//             }}
//             order={currentOrder}
//             vendors={vendors}
//           />
//         </>
//       );
//       break;
//     case 'alerts':
//       content = (
//         <StockAlertTable
//           alerts={alerts}
//           onReorder={(equipmentId) => {
//             // Handle reorder logic
//           }}
//           search={alertSearch}
//           onSearch={setAlertSearch}
//         />
//       );
//       break;
//     default:
//       content = <Box sx={{ p: 3 }}>Select a section</Box>;
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box sx={{ 
//         display: 'flex', 
//         minHeight: '100vh',
//         bgcolor: 'background.default', // This will use the theme's background color
//         color: 'text.primary' // This will use the theme's text color
//       }}>
//         <ProcurementSidebar
//           collapsed={collapsed}
//           onToggleCollapse={() => setCollapsed(!collapsed)}
//           selected={nav}
//           onSelect={setNav}
//         />
//         <Box 
//           component="main"
//           sx={{ 
//             flexGrow: 1,
//             p: 3,
//             width: `calc(100% - ${collapsed ? 64 : 240}px)`,
//             transition: theme.transitions.create(['width', 'margin'], {
//               easing: theme.transitions.easing.sharp,
//               duration: theme.transitions.duration.leavingScreen,
//             }),
//             ml: `${collapsed ? 64 : 100}px`
//           }}
//         >
//           <ProcurementAppBar 
//             title={nav}
//             mode={mode}
//             onToggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')}
//             onToggleSidebar={() => setCollapsed(!collapsed)}
//           />
//           <Toolbar /> {/* Spacer for AppBar */}
//           {content}
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  Toolbar, 
  createTheme,
  CircularProgress
} from '@mui/material';
// import ProcurementSidebar from './ProcurementSidebar';
// import DashboardSummary from './DashboardSummary';
// import EquipmentTable from './EquipmentTable';
// import EquipmentForm from './EquipmentForm';
// import VendorTable from './VendorTable';
// import VendorForm from './VendorForm';
// import PurchaseOrderTable from './PurchaseOrderTable';
// import PurchaseOrderForm from './PurchaseOrderForm';
// import StockAlertTable from './StockAlertTable';
// import ProcurementAppBar from './ProcurementAppBar';

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
  STOCK_LEVEL_ENDPOINTS,
  PURCHASE_ORDER_ITEM_ENDPOINTS,
  NOTIFICATION_ENDPOINTS
} from '../../API_ENDPOINTS/API'
import axios from 'axios';

export default function ProcurementDashboard() {
  const [mode, setMode] = useState('light');
  const [collapsed, setCollapsed] = useState(false);
  const [nav, setNav] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [equipment, setEquipment] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Form states
  const [equipmentDialog, setEquipmentDialog] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [vendorDialog, setVendorDialog] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
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
          const itemsRes = await axios.get(PURCHASE_ORDER_ITEM_ENDPOINTS.GET_BY_PO_ID(order.id));
          return {
            ...order,
            items: itemsRes.data,
            vendorName: vendorRes.data.find(v => v.id === order.vendorId)?.name || ''
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
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle equipment operations
  const handleEquipmentSave = async (data) => {
    try {
      const promise = currentEquipment 
        ? axios.put(EQUIPMENT_ENDPOINTS.UPDATE(currentEquipment.id), data)
        : axios.post(EQUIPMENT_ENDPOINTS.CREATE, data);
      
      await promise;
      await fetchData();
      setEquipmentDialog(false);
      setCurrentEquipment(null);
    } catch (err) {
      console.error('Error saving equipment:', err);
    }
  };

  const handleEquipmentDelete = async (id) => {
    try {
      await axios.delete(EQUIPMENT_ENDPOINTS.DELETE(id));
      await fetchData();
    } catch (err) {
      console.error('Error deleting equipment:', err);
    }
  };

  // Handle vendor operations
  const handleVendorSave = async (data) => {
    try {
      const promise = currentVendor 
        ? axios.put(VENDOR_ENDPOINTS.UPDATE(currentVendor.id), data)
        : axios.post(VENDOR_ENDPOINTS.CREATE, data);
      
      await promise;
      await fetchData();
      setVendorDialog(false);
      setCurrentVendor(null);
    } catch (err) {
      console.error('Error saving vendor:', err);
    }
  };

  const handleVendorDelete = async (id) => {
    try {
      await axios.delete(VENDOR_ENDPOINTS.DELETE(id));
      await fetchData();
    } catch (err) {
      console.error('Error deleting vendor:', err);
    }
  };

  // // Handle purchase order operations
  // const handleOrderSave = async (data) => {
  //   try {
  //     // First save the order
  //     const orderPromise = currentOrder 
  //       ? axios.put(PURCHASE_ORDER_ENDPOINTS.UPDATE(currentOrder.id), data)
  //       : axios.post(PURCHASE_ORDER_ENDPOINTS.CREATE, data);
      
  //     const orderRes = await orderPromise;
  //     const orderId = orderRes.data.id || currentOrder.id;

  //     // Then save/update items
  //     await Promise.all(
  //       data.items.map(item => {
  //         const itemData = {
  //           poId: orderId,
  //           equipmentId: item.equipmentId,
  //           quantity: item.quantity,
  //           unitPrice: item.unitPrice,
  //           total: item.quantity * item.unitPrice
  //         };
          
  //         return item.id 
  //           ? axios.put(PURCHASE_ORDER_ITEM_ENDPOINTS.UPDATE(item.id), itemData)
  //           : axios.post(PURCHASE_ORDER_ITEM_ENDPOINTS.CREATE, itemData);
  //       })
  //     );

  //     // Delete any removed items
  //     if (currentOrder) {
  //       const currentItemIds = currentOrder.items.map(i => i.id);
  //       const newItemIds = data.items.map(i => i.id).filter(Boolean);
  //       const itemsToDelete = currentItemIds.filter(id => !newItemIds.includes(id));
        
  //       await Promise.all(
  //         itemsToDelete.map(id => 
  //           axios.delete(PURCHASE_ORDER_ITEM_ENDPOINTS.DELETE(id))
  //         )
  //       );
  //     }

  //     await fetchData();
  //     setOrderDialog(false);
  //     setCurrentOrder(null);
  //   } catch (err) {
  //     console.error('Error saving order:', err);
  //   }
  // };

  const handleOrderSave = async (data) => {
    try {
      // Validate data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid order data');
      }

      // Ensure required fields exist
      const orderData = {
        ...data,
        items: Array.isArray(data.items) ? data.items : [],
        poNumber: data.poNumber || generatePONumber(),
        vendorId: data.vendorId || '',
        status: data.status || 'Pending'
      };

      // First save the order
      const orderPromise = currentOrder 
        ? axios.put(PURCHASE_ORDER_ENDPOINTS.UPDATE(currentOrder.id), orderData)
        : axios.post(PURCHASE_ORDER_ENDPOINTS.CREATE, orderData);
      
      const orderRes = await orderPromise;
      const orderId = orderRes.data?.id || currentOrder?.id;

      if (!orderId) {
        throw new Error('Failed to get order ID');
      }

      // Process items
      const itemsToProcess = orderData.items.filter(item => 
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
          
          return item.id 
            ? axios.put(PURCHASE_ORDER_ITEM_ENDPOINTS.UPDATE(item.id), itemData)
            : axios.post(PURCHASE_ORDER_ITEM_ENDPOINTS.CREATE, itemData);
        })
      );

      // Delete any removed items if editing
      if (currentOrder && Array.isArray(currentOrder.items)) {
        const currentItemIds = currentOrder.items.map(i => i.id).filter(Boolean);
        const newItemIds = itemsToProcess.map(i => i.id).filter(Boolean);
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
    } catch (err) {
      console.error('Error saving order:', err);
      // Consider showing error to user
      // setError(err.message);
    }
  };

  // const handleOrderSave = async (data) => {
  //   try {
  //     // Clean and validate data
  //     const orderData = {
  //       ...data,
  //       poNumber: data.poNumber || generatePONumber(),
  //       items: data.items.map(item => ({
  //         equipmentId: item.equipmentId,
  //         quantity: item.quantity,
  //         unitPrice: item.unitPrice
  //       }))
  //     };

  //     // Send to backend
  //     const savedOrder = await (currentOrder 
  //       ? axios.put(`${PURCHASE_ORDER_ENDPOINTS.UPDATE(currentOrder.id)}`, orderData)
  //       : axios.post(PURCHASE_ORDER_ENDPOINTS.CREATE, orderData));

  //     await fetchData();
  //     setOrderDialog(false);
  //     setCurrentOrder(null);
  //   } catch (err) {
  //     console.error('Error saving order:', err);
  //   }
  // };

  // Handle reorder from alerts
  const handleReorder = (equipmentId) => {
    const equipmentToOrder = equipment.find(e => e.id === equipmentId);
    if (!equipmentToOrder) return;

    setCurrentOrder({
      poNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      vendorId: equipmentToOrder.vendorId,
      dateIssued: new Date(),
      status: 'Pending',
      items: [{
        equipmentId: equipmentToOrder.id,
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
            />
          </>
        );
        break;
      case 'orders':
        content = (
          <>
            <PurchaseOrderTable
              orders={orders}
              onEdit={(order) => {
                setCurrentOrder(order);
                setOrderDialog(true);
              }}
              onView={(id) => {
                // Handle view order details
                const order = orders.find(o => o.id === id);
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
                n.recipientId === currentOrder?.id
              )}
            />
          </>
        );
        break;
      case 'alerts':
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
            width: `calc(100% - ${collapsed ? 64 : 240}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            ml: `${collapsed ? 64 : 240}px`
          }}
        >
          <ProcurementAppBar 
            title={nav}
            mode={mode}
            onToggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')}
            onToggleSidebar={() => setCollapsed(!collapsed)}
          />
          <Toolbar />
          {content}
        </Box>
      </Box>
    </ThemeProvider>
  );
}