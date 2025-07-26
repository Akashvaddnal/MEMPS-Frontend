// // import React from 'react';
// // import PropTypes from 'prop-types';
// // import { 
// //   Drawer, 
// //   Toolbar, 
// //   List, 
// //   ListItem, 
// //   ListItemIcon, 
// //   ListItemText, 
// //   Divider 
// // } from '@mui/material';
// // import DashboardIcon from '@mui/icons-material/Dashboard';
// // import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
// // import StoreIcon from '@mui/icons-material/Store';
// // import ReceiptIcon from '@mui/icons-material/Receipt';
// // import WarningIcon from '@mui/icons-material/Warning';
// // import HistoryIcon from '@mui/icons-material/History';

// // const NAV_ITEMS = [
// //   { label: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
// //   { label: 'Equipment', icon: <MedicalServicesIcon />, key: 'equipment' },
// //   { label: 'Vendors', icon: <StoreIcon />, key: 'vendors' },
// //   { label: 'Purchase Orders', icon: <ReceiptIcon />, key: 'orders' },
// //   { label: 'Stock Alerts', icon: <WarningIcon />, key: 'alerts' },
// //   { label: 'History', icon: <HistoryIcon />, key: 'history' },
// // ];

// // export default function ProcurementSidebar({ 
// //   mini, 
// //   selected, 
// //   onSelect 
// // }) {
// //   return (
// //     <Drawer
// //       variant="permanent"
// //       sx={{
// //         width: mini ? 64 : 220,
// //         '& .MuiDrawer-paper': {
// //           width: mini ? 64 : 220,
// //           boxSizing: 'border-box',
// //         },
// //       }}
// //     >
// //       <Toolbar />
// //       <List>
// //         {NAV_ITEMS.map((item) => (
// //           <ListItem 
// //             button 
// //             key={item.key}
// //             selected={selected === item.key}
// //             onClick={() => onSelect(item.key)}
// //             sx={{
// //               justifyContent: mini ? 'center' : 'flex-start',
// //               px: mini ? 1 : 3,
// //             }}
// //           >
// //             <ListItemIcon sx={{ minWidth: 0, mr: mini ? 0 : 2 }}>
// //               {item.icon}
// //             </ListItemIcon>
// //             {!mini && <ListItemText primary={item.label} />}
// //           </ListItem>
// //         ))}
// //       </List>
// //     </Drawer>
// //   );
// // }

// // ProcurementSidebar.propTypes = {
// //   mini: PropTypes.bool.isRequired,
// //   selected: PropTypes.string.isRequired,
// //   onSelect: PropTypes.func.isRequired,
// // };


// import React from 'react';
// import PropTypes from 'prop-types';
// import { 
//   Drawer, 
//   Toolbar, 
//   List, 
//   ListItem, 
//   ListItemIcon, 
//   ListItemText, 
//   Divider,
//   useTheme
// } from '@mui/material';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
// import StoreIcon from '@mui/icons-material/Store';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import WarningIcon from '@mui/icons-material/Warning';
// import HistoryIcon from '@mui/icons-material/History';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import IconButton from '@mui/material/IconButton';

// const drawerWidth = 240;
// const collapsedWidth = 64;

// const NAV_ITEMS = [
//   { label: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
//   { label: 'Equipment', icon: <MedicalServicesIcon />, key: 'equipment' },
//   { label: 'Vendors', icon: <StoreIcon />, key: 'vendors' },
//   { label: 'Purchase Orders', icon: <ReceiptIcon />, key: 'orders' },
//   { label: 'Stock Alerts', icon: <WarningIcon />, key: 'alerts' },
//   { label: 'History', icon: <HistoryIcon />, key: 'history' },
// ];

// export default function ProcurementSidebar({ 
//   collapsed, 
//   onToggleCollapse, 
//   selected, 
//   onSelect 
// }) {
//   const theme = useTheme();

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: collapsed ? collapsedWidth : drawerWidth,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: collapsed ? collapsedWidth : drawerWidth,
//           boxSizing: 'border-box',
//           bgcolor: 'background.paper',
//           transition: theme.transitions.create('width', {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//           }),
//           overflowX: 'hidden',
//         },
//       }}
//     >
//       <Toolbar sx={{ 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'flex-end',
//         px: [1],
//       }}>
//         <IconButton onClick={onToggleCollapse}>
//           {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//         </IconButton>
//       </Toolbar>
//       <Divider />
//       <List>
//         {NAV_ITEMS.map((item) => (
//           <ListItem 
//             key={item.key}
//             selected={selected === item.key}
//             onClick={() => onSelect(item.key)}
//             sx={{
//               minHeight: 48,
//               justifyContent: collapsed ? 'center' : 'initial',
//               px: 2.5,
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 minWidth: 0,
//                 mr: collapsed ? 0 : 3,
//                 justifyContent: 'center',
//                 color: selected === item.key ? 'primary.main' : 'inherit',
//               }}
//             >
//               {item.icon}
//             </ListItemIcon>
//             {!collapsed && (
//               <ListItemText 
//                 primary={item.label} 
//                 primaryTypographyProps={{
//                   fontWeight: selected === item.key ? 'bold' : 'normal',
//                 }}
//               />
//             )}
//           </ListItem>
//         ))}
//       </List>
//     </Drawer>
//   );
// }

// ProcurementSidebar.propTypes = {
//   collapsed: PropTypes.bool.isRequired,
//   onToggleCollapse: PropTypes.func.isRequired,
//   selected: PropTypes.string.isRequired,
//   onSelect: PropTypes.func.isRequired,
// };

import React from 'react';
import PropTypes from 'prop-types';
import { 
  Drawer, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Divider,
  useTheme,
  styled
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WarningIcon from '@mui/icons-material/Warning';
import HistoryIcon from '@mui/icons-material/History';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';

const drawerWidth = 240;
const collapsedWidth = 64;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
  { label: 'Equipment', icon: <MedicalServicesIcon />, key: 'equipment' },
  { label: 'Vendors', icon: <StoreIcon />, key: 'vendors' },
  { label: 'Purchase Orders', icon: <ReceiptIcon />, key: 'orders' },
  { label: 'Stock Alerts', icon: <WarningIcon />, key: 'alerts' },
  { label: 'History', icon: <HistoryIcon />, key: 'history' },
];

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  minHeight: 48,
  justifyContent: 'initial',
  px: 2.5,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function ProcurementSidebar({ 
  collapsed, 
  onToggleCollapse, 
  selected, 
  onSelect 
}) {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end',
        px: [1],
        minHeight: '64px !important'
      }}>
        <IconButton onClick={onToggleCollapse}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ p: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItem 
            key={item.key}
            disablePadding
            sx={{ display: 'block' }}
          >
            <StyledListItemButton
              selected={selected === item.key}
              onClick={() => onSelect(item.key)}
              sx={{
                justifyContent: collapsed ? 'center' : 'initial',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 'auto' : 3,
                  justifyContent: 'center',
                  color: selected === item.key ? theme.palette.primary.main : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontWeight: selected === item.key ? '600' : 'normal',
                  }}
                />
              )}
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

ProcurementSidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};