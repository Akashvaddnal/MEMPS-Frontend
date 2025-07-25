import React from 'react';
import PropTypes from 'prop-types';
import { 
  Drawer, 
  Toolbar, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WarningIcon from '@mui/icons-material/Warning';
import HistoryIcon from '@mui/icons-material/History';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
  { label: 'Equipment', icon: <MedicalServicesIcon />, key: 'equipment' },
  { label: 'Vendors', icon: <StoreIcon />, key: 'vendors' },
  { label: 'Purchase Orders', icon: <ReceiptIcon />, key: 'orders' },
  { label: 'Stock Alerts', icon: <WarningIcon />, key: 'alerts' },
  { label: 'History', icon: <HistoryIcon />, key: 'history' },
];

export default function ProcurementSidebar({ 
  mini, 
  selected, 
  onSelect 
}) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: mini ? 64 : 220,
        '& .MuiDrawer-paper': {
          width: mini ? 64 : 220,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem 
            button 
            key={item.key}
            selected={selected === item.key}
            onClick={() => onSelect(item.key)}
            sx={{
              justifyContent: mini ? 'center' : 'flex-start',
              px: mini ? 1 : 3,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: mini ? 0 : 2 }}>
              {item.icon}
            </ListItemIcon>
            {!mini && <ListItemText primary={item.label} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

ProcurementSidebar.propTypes = {
  mini: PropTypes.bool.isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};