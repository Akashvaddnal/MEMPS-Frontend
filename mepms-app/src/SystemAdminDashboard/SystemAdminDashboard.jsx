import React, { useState, useEffect, useMemo } from 'react';
import {
 Button,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Stack,
  IconButton,
  Avatar,
 
  CssBaseline,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Sidebar from './components/Sidebar';
import ThemeToggleButton from './components/ThemeToggleButton';
import AccountMenu from './components/AccountMenu';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import RoleTable from './components/RoleTable';
import RoleForm from './components/RoleForm';
import AuditLogTable from './components/AuditLogTable';
import DashboardSummary from './components/DashboardSummary';
import AddIcon from '@mui/icons-material/Add';
import {jwtDecode} from 'jwt-decode';

import axios from 'axios';

const DRAWER_WIDTH = 220;
const MINI_SIDEBAR_WIDTH = 62;

export default function SystemAdminDashboard() {
  const [mini, setMini] = useState(false);
  const [nav, setNav] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [logs, setLogs] = useState([]);

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);

  const [userSearch, setUserSearch] = useState('');
  const [userFilters, setUserFilters] = useState({ role: '', department: '' });

  const [roleSearch, setRoleSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');

  const [mode, setMode] = useState('light');
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1976d2' },
          secondary: { main: '#9c27b0' },
          background: {
            paper: mode === 'light' ? '#fff' : '#121212',
            default: mode === 'light' ? '#f4f6f8' : '#121212',
          },
        },
      }),
    [mode]
  );

  // Fetch data
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      // Optionally decode token to get user id/email/role
      const decoded = jwtDecode(token);
      // For example: decoded.email or decoded.sub (subject)
      const userEmail = decoded.sub || decoded.email;

      // Make an API call to get current user based on token
      axios.get('http://localhost:9090/System-Admin-MS/api/users/current', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setCurrentUser(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch current user', err);
        // Optionally handle logout or token invalidation here
      });
    } catch (err) {
      console.error('Invalid token', err);
      // Optionally handle invalid token (logout user)
    }

    axios.get('http://localhost:9090/System-Admin-MS/api/users').then(res => setUsers(res.data));
    axios.get('http://localhost:9090/System-Admin-MS/api/roles').then(res => setRoles(res.data));
    axios.get('http://localhost:9090/System-Admin-MS/api/audit-logs').then(res => setLogs(res.data));
  }, []);

  // User Save/Delete handlers
  const handleSaveUser = (data) => {
    if (editUser) {
      axios.put(`http://localhost:9090/System-Admin-MS/api/users/${editUser.id}`, data)
        .then(() => {
          setUserDialogOpen(false);
          setEditUser(null);
          return axios.get('http://localhost:9090/System-Admin-MS/api/users');
        })
        .then(res => setUsers(res.data));
    } else {
      axios.post('http://localhost:9090/System-Admin-MS/api/users', data)
        .then(() => {
          setUserDialogOpen(false);
          setEditUser(null);
          return axios.get('http://localhost:9090/System-Admin-MS/api/users');
        })
        .then(res => setUsers(res.data));
    }
  };

  const handleDeleteUser = (id) => {
    axios.delete(`http://localhost:9090/System-Admin-MS/api/users/${id}`)
      .then(() => axios.get('http://localhost:9090/System-Admin-MS/api/users'))
      .then(res => setUsers(res.data));
  };

  // Role Save/Delete handlers
  const handleSaveRole = (data) => {
    if (editRole) {
      axios.put(`http://localhost:9090/System-Admin-MS/api/roles/${editRole.id}`, data)
        .then(() => {
          setRoleDialogOpen(false);
          setEditRole(null);
          return axios.get('http://localhost:9090/System-Admin-MS/api/roles');
        })
        .then(res => setRoles(res.data));
    } else {
      axios.post('http://localhost:9090/System-Admin-MS/api/roles', data)
        .then(() => {
          setRoleDialogOpen(false);
          setEditRole(null);
          return axios.get('http://localhost:9090/System-Admin-MS/api/roles');
        })
        .then(res => setRoles(res.data));
    }
  };

  const handleDeleteRole = (id) => {
    axios.delete(`http://localhost:9090/System-Admin-MS/api/roles/${id}`)
      .then(() => axios.get('http://localhost:9090/System-Admin-MS/api/roles'))
      .then(res => setRoles(res.data));
  };

  // Current user info
  console.log('🚀 Dashboard loaded');

  // const currentUser = {
  //   name: 'Akash Kashyap',
  //   email: 'bharatkashyap@outlook.com',
  //   image: 'https://avatars.githubusercontent.com/u/19550456',
  // };
  const userInfo = currentUser || {
    name: '',
    email: '',
    profilePic: '',
  };

   const avatarSrc = userInfo?.profilePic
  ? userInfo.profilePic.startsWith('data:')
    ? userInfo.profilePic
    : `data:image/jpeg;base64,${userInfo.profilePic}`
  : '';

  let content;
  switch (nav) {
    case 'dashboard':
      content = <DashboardSummary users={users} roles={roles} logs={logs} />;
      break;
    case 'orders':
      content = <Typography sx={{ p: 3 }}>Orders content placeholder.</Typography>;
      break;
    case 'users':
      content = (
        <>
          <Box sx={{ mb: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setUserDialogOpen(true)}
            >
              Add User
            </Button>
          </Box>
          <UserTable
            users={users}
            onEdit={(user) => {
              setEditUser(user);
              setUserDialogOpen(true);
            }}
            onDelete={handleDeleteUser}
            search={userSearch}
            onSearch={setUserSearch}
            filters={userFilters}
            onFilter={setUserFilters}
          />
          <UserForm
            open={userDialogOpen}
            onClose={() => {
              setUserDialogOpen(false);
              setEditUser(null);
            }}
            onSave={handleSaveUser}
            user={editUser}
          />
        </>
      );
      break;
    case 'roles':
      content = (
        <>
          <Box sx={{ mb: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setRoleDialogOpen(true)}
            >
              Add Role
            </Button>
          </Box>
          <RoleTable
            roles={roles}
            onEdit={(role) => {
              setEditRole(role);
              setRoleDialogOpen(true);
            }}
            onDelete={handleDeleteRole}
            search={roleSearch}
            onSearch={setRoleSearch}
          />
          <RoleForm
            open={roleDialogOpen}
            onClose={() => {
              setRoleDialogOpen(false);
              setEditRole(null);
            }}
            onSave={handleSaveRole}
            role={editRole}
          />
        </>
      );
      break;
    case 'auditLogs':
      content = (
        <AuditLogTable
          logs={logs}
          search={logSearch}
          onSearch={setLogSearch}
        />
      );
      break;
    default:
      content = <Typography sx={{ p: 3 }}>Select a Section</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar user={userInfo} mini={mini} selected={nav} onSelect={setNav} onMiniToggle={() => setMini(b => !b)} />
        {/* <Box
          sx={{
            flexGrow: 1,
            ml: mini ? MINI_SIDEBAR_WIDTH : DRAWER_WIDTH,
            transition: theme.transitions.create('margin'),
          }}
        > */}
        <Box
            sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            transition: theme =>
                theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
                }),
            ml: mini ? `${MINI_SIDEBAR_WIDTH}px` : `${60}px`,
            mt:-2,
            mr: mini ? `${MINI_SIDEBAR_WIDTH}px` : 5,
            }}
        >
          <AppBar
            position="fixed"
            color="inherit"
            sx={{
              width: `calc(100% - ${mini ? MINI_SIDEBAR_WIDTH : DRAWER_WIDTH}px)`,
              left: mini ? MINI_SIDEBAR_WIDTH : DRAWER_WIDTH,
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                {nav}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <ThemeToggleButton toggleColorMode={colorMode.toggleColorMode} />
                <IconButton onClick={e => setAccountMenuAnchor(e.currentTarget)} size="small" aria-label="Open account menu">
                  <Avatar alt={userInfo.name} src={avatarSrc} />
                  <MoreVertIcon sx={{ ml: 0.5 }} />
                </IconButton>
                <AccountMenu
                  anchorEl={accountMenuAnchor}
                  open={Boolean(accountMenuAnchor)}
                  onClose={() => setAccountMenuAnchor(null)}
                  onSignOut={() => {
                    setAccountMenuAnchor(null);
                    // Add your sign-out logic here
                    alert('Signed out');
                  }}
                  user={userInfo}
                />
              </Stack>
            </Toolbar>
          </AppBar>
          <Toolbar />{/* Spacer */}
          <Box component="main" sx={{ flexGrow: 1,width: '100%',  p: 3 , overflow: 'auto' }}>
            {content}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
