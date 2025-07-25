import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Typography,Stack,Avatar,Divider,AppBar,Toolbar,IconButton,Drawer,List,ListItem,ListItemIcon,ListItemText,CssBaseline,Button,
  Menu,MenuItem,useTheme,TextField,InputAdornment,Paper,Table,TableBody,TableCell,TableContainer, TableHead,TableRow,TablePagination, Dialog, DialogTitle, DialogContent,DialogActions,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';


const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, key: 'dashboard' },
  { label: 'Orders', icon: <ShoppingCartIcon />, key: 'orders' },
  { label: 'User Management', icon: <GroupIcon />, key: 'users' },
  { label: 'Role Management', icon: <SecurityIcon />, key: 'roles' },
  { label: 'Audit Logs', icon: <HistoryIcon />, key: 'auditLogs' },
];

const DRAWER_WIDTH = 220;
const MINI_SIDEBAR_WIDTH = 62;

// ---------------- Account Menu ------------------
function AccountMenu({ anchorEl, open, onClose, onSignOut, user }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box sx={{ p: 1.5, minWidth: 220 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={user.image} alt={user.name} />
          <Box>
            <Typography fontWeight="bold">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Divider />
      <MenuItem onClick={onSignOut}>Sign out</MenuItem>
    </Menu>
  );
}

AccountMenu.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

// ---------------- Sidebar component -----------------
function Sidebar({ mini, selected, onSelect, onMiniToggle }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: mini ? MINI_SIDEBAR_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: mini ? MINI_SIDEBAR_WIDTH : DRAWER_WIDTH,
          transition: theme =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          overflowX: 'hidden',
        },
      }}
      PaperProps={{ elevation: 3 }}
    >
      <Toolbar sx={{ justifyContent: mini ? 'center' : 'space-between', px: 1 }}>
        {mini ? (
          <Avatar sx={{ width: 36, height: 36 }} src="https://avatars.githubusercontent.com/u/19550456" />
        ) : (
          <Typography variant="h6" noWrap fontWeight="medium">
            Admin Dashboard
          </Typography>
        )}
        <IconButton
          onClick={onMiniToggle}
          sx={{ ml: mini ? 0 : 2, display: mini ? 'none' : 'inline-flex' }}
          size="small"
          aria-label={mini ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          onClick={onMiniToggle}
          sx={{ mx: 'auto', display: mini ? 'inline-flex' : 'none', mt: 1 }}
          size="small"
          aria-label={mini ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {NAV_ITEMS.map(nav => (
          <ListItem
            button
            key={nav.key}
            selected={selected === nav.key}
            onClick={() => onSelect(nav.key)}
            sx={{
              justifyContent: mini ? 'center' : 'initial',
              px: mini ? 1 : 2.5,
              py: 0.5,
              borderRadius: 1,
              ...(selected === nav.key && {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
              }),
              '&:hover': {
                bgcolor: selected === nav.key ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: mini ? 0 : 2, justifyContent: 'center' }}>{nav.icon}</ListItemIcon>
            {!mini && <ListItemText primary={nav.label} />}
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
    </Drawer>
  );
}

Sidebar.propTypes = {
  mini: PropTypes.bool.isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onMiniToggle: PropTypes.func.isRequired,
};

// ---------------- Theme Toggle Button -----------------
function ThemeToggleButton({ toggleColorMode }) {
  const theme = useTheme();
  return (
    <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit" aria-label="toggle theme">
      {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

ThemeToggleButton.propTypes = {
  toggleColorMode: PropTypes.func.isRequired,
};

// ---------------- Search Bar -----------------
function SearchBar({ value, onChange, placeholder, sx }) {
  return (
    <TextField
      variant="outlined"
      size="small"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      sx={{ mb: 2, width: 300, maxWidth: '100%', ...sx }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
};

// ---------------- User Management Components -----------------
function UserTable({ users, onEdit, onDelete, search, onSearch, filters, onFilter }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const filtered = users.filter(
    u =>
      (u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
        u.department?.toLowerCase().includes(search.toLowerCase())) &&
      (filters.role ? u.roleId === filters.role : true) &&
      (filters.department ? u.department === filters.department : true)
  );

  React.useEffect(() => {
    setPage(0);
  }, [search, filters]);

  return (
    <Box sx={{ 
       width: '100%',
  maxWidth: '100vw',               // Never overflows window
  pl: 0, pr: 0,                    // Remove any inner horizontal pad
  overflowX: 'auto'  // Allow horizontal scrolling if needed
     }}>
      {/* Table filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={onSearch} placeholder="Search by name, ID, department..." sx={{ mt: 2 }} />
        <TextField
          select
          label="Role"
          value={filters.role}
          onChange={e => onFilter({ ...filters, role: e.target.value })}
          size="small"
          sx={{ width: 150, mt:2 }}
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="clinician">Clinician</MenuItem>
        </TextField>
        <TextField
          select
          label="Department"
          value={filters.department}
          onChange={e => onFilter({ ...filters, department: e.target.value })}
          size="small"
          sx={{ width: 150, mt:2 }}
        >
          <MenuItem value="">All Departments</MenuItem>
          <MenuItem value="Cardiology">Cardiology</MenuItem>
          <MenuItem value="Radiology">Radiology</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} elevation={1}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.roleName}</TableCell>
                
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(user)} size="small" color="primary" aria-label="edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(user.id)} size="small" color="error" aria-label="delete">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.875rem' } }}
        />
      </TableContainer>
    </Box>
  );
}


UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
};

function UserForm({ open, onClose, onSave, user }) {
  const [form, setForm] = React.useState(
    user || {
      username: '',
      email: '',
      password: '',
      department: '',
      roleName: '',
    }
  );
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    setForm(
      user || {
        username: '',
        email: '',
        password: '',
        department: '',
        roleName: '',
      }
    );
  }, [user]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          fullWidth
          variant="outlined"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          variant="outlined"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  size="small"
                >
                  <VisibilityOffIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="dense"
          label="Department"
          fullWidth
          variant="outlined"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Role"
          fullWidth
          variant="outlined"
          value={form.roleName}
          onChange={e => setForm({ ...form, roleName: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={() => onSave(form)} variant="contained" color="primary">
          {user ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UserForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  user: PropTypes.object,
};

// ---------------- Role Management Components --------------------

function RoleTable({ roles, onEdit, onDelete, search, onSearch }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const filtered = roles.filter(
    r => r.name?.toLowerCase().includes(search.toLowerCase()) || r.id?.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    setPage(0);
  }, [search]);

  return (
    <Box>
      <SearchBar value={search} onChange={onSearch} placeholder="Search by role name or ID..." />
      <TableContainer component={Paper} elevation={1}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(role => (
              <TableRow key={role.id}>
                <TableCell>{role.roleName}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(role)} size="small" color="primary" aria-label="edit">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(role.id)} size="small" color="error" aria-label="delete">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  No roles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.875rem' } }}
        />
      </TableContainer>
    </Box>
  );
}

RoleTable.propTypes = {
  roles: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

function RoleForm({ open, onClose, onSave, role }) {
  const [form, setForm] = React.useState(role || { roleName: '', description: '' });

  React.useEffect(() => {
    setForm(role || { roleName: '', description: '' });
  }, [role]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{role ? 'Edit Role' : 'Add Role'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Role Name"
          fullWidth
          variant="outlined"
          value={form.roleName}
          onChange={e => setForm({ ...form, roleName: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={() => onSave(form)} variant="contained" color="primary">
          {role ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RoleForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  role: PropTypes.object,
};

// ---------------- Audit Logs -------------------

function AuditLogTable({ logs, search, onSearch }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const filtered = logs.filter(
    l =>
      l.userId?.toLowerCase().includes(search.toLowerCase()) ||
      l.action?.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    setPage(0);
  }, [search]);

  return (
    <Box>
      <SearchBar value={search} onChange={onSearch} placeholder="Search by user ID or action..." />
      <TableContainer component={Paper} elevation={1}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Log ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.userId}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.875rem' } }}
        />
      </TableContainer>
    </Box>
  );
}

AuditLogTable.propTypes = {
  logs: PropTypes.array.isRequired,
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

// ---------------- Main Dashboard Component -------------------

export default function SystemAdminDashboard() {
  // Sidebar mini state
  const [mini, setMini] = React.useState(false);

  // Navigation state
  const [nav, setNav] = React.useState('dashboard');

  // Data state
  const [users, setUsers] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [logs, setLogs] = React.useState([]);

  // Dialog state
  const [userDialogOpen, setUserDialogOpen] = React.useState(false);
  const [editUser, setEditUser] = React.useState(null);

  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [editRole, setEditRole] = React.useState(null);

  // Search/filter state
  const [userSearch, setUserSearch] = React.useState('');
  const [userFilters, setUserFilters] = React.useState({ role: '', department: '' });
  const [roleSearch, setRoleSearch] = React.useState('');
  const [logSearch, setLogSearch] = React.useState('');

  // Theme toggle
  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(() => ({
    toggleColorMode: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
  }), []);

  const theme = React.useMemo(
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
        components: {
          MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        },
      }),
    [mode]
  );

  // Fetch data effect
  React.useEffect(() => {
    axios.get('http://localhost:9090/System-Admin-MS/api/users').then(res => setUsers(res.data));
    axios.get('http://localhost:9090/System-Admin-MS/api/roles').then(res => setRoles(res.data));
    axios.get('http://localhost:9090/System-Admin-MS/api/audit-logs').then(res => setLogs(res.data));
  }, []);

  // Account user info
  const currentUser = {
    name: 'Bharat Kashyap',
    email: 'bharatkashyap@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
  };

  // Account menu anchor
  const [accountMenuAnchor, setAccountMenuAnchor] = React.useState(null);

  // User CRUD
  const handleSaveUser = data => {
    if (editUser) {
      axios
        .put(`http://localhost:9090/System-Admin-MS/api/users/${editUser.id}`, data)
        .then(() => {
          setUserDialogOpen(false);
          setEditUser(null);
          return axios.get('http://localhost:9090/System-Admin-MS/api/users');
        })
        .then(res => setUsers(res.data));
    } else {
      axios
        .post('http://localhost:9090/System-Admin-MS/api/users', data)
        .then(() => {
          setUserDialogOpen(false);
          setEditUser(null);
          return axios.get('http://localhost:9090/System-Admin-MS/api/users');
        })
        .then(res => setUsers(res.data));
    }
  };

  const handleDeleteUser = id => {
    axios
      .delete(`http://localhost:9090/System-Admin-MS/api/users/${id}`)
      .then(() => axios.get('http://localhost:9090/System-Admin-MS/api/users'))
      .then(res => setUsers(res.data));
  };

  // Role CRUD
  const handleSaveRole = data => {
    if (editRole) {
      axios
        .put(`http://localhost:9090/System-Admin-MS/api/roles/${editRole.id}`, data)
        .then(() => {
          setRoleDialogOpen(false);
          setEditRole(null);
          return axios.get('http://localhost:9090/System-Admin-MS/api/roles');
        })
        .then(res => setRoles(res.data));
    } else {
      axios
        .post('http://localhost:9090/System-Admin-MS/api/roles', data)
        .then(() => {
          setRoleDialogOpen(false);
          setEditRole(null);
          return axios.get('http://localhost:9090/System-Admin-MS/api/roles');
        })
        .then(res => setRoles(res.data));
    }
  };

  const handleDeleteRole = id => {
    axios
      .delete(`http://localhost:9090/System-Admin-MS/api/roles/${id}`)
      .then(() => axios.get('http://localhost:9090/System-Admin-MS/api/roles'))
      .then(res => setRoles(res.data));
  };

  // Navigation content switching
  let content = null;
  if (nav === 'dashboard') {
    content = <Typography sx={{ p: 3 }}>Welcome to the Dashboard!</Typography>;
  } else if (nav === 'orders') {
    content = <Typography sx={{ p: 3 }}>Orders content placeholder.</Typography>;
  } else if (nav === 'users') {
    content = (
      <>
        <UserTable
          users={users}
          onEdit={user => {
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
  } else if (nav === 'roles') {
    content = (
      <>
        <RoleTable
          roles={roles}
          onEdit={role => {
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
  } else if (nav === 'auditLogs') {
    content = <AuditLogTable logs={logs} search={logSearch} onSearch={setLogSearch} />;
  } else {
    content = <Typography sx={{ p: 3 }}>Select an item from the sidebar.</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar mini={mini} selected={nav} onSelect={setNav} onMiniToggle={() => setMini(m => !m)} />
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
            ml: mini ? `${MINI_SIDEBAR_WIDTH}px` : `${100}px`,
            mt:5
          }}
        >
          <AppBar
            elevation={2}
            position="fixed"
            color="inherit"
            sx={{
              zIndex: theme => theme.zIndex.drawer + 1,
              width: `calc(100% - ${mini ? MINI_SIDEBAR_WIDTH : DRAWER_WIDTH}px)`,
              left: mini ? `${MINI_SIDEBAR_WIDTH}px` : `${DRAWER_WIDTH}px`,
            }}
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 64 }}>
              <Typography variant="h6" color="inherit">
                {NAV_ITEMS.find(i => i.key === nav)?.label}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <ThemeToggleButton toggleColorMode={colorMode.toggleColorMode} />
                <IconButton onClick={e => setAccountMenuAnchor(e.currentTarget)} size="small" aria-label="Open account menu">
                  <Avatar alt={currentUser.name} src={currentUser.image} />
                  <MoreVertIcon sx={{ ml: 0.5 }} />
                </IconButton>
                <AccountMenu
                  anchorEl={accountMenuAnchor}
                  open={Boolean(accountMenuAnchor)}
                  onClose={() => setAccountMenuAnchor(null)}
                  onSignOut={() => {
                    setAccountMenuAnchor(null);
                    // Implement your sign out logic here
                    alert('Signed out');
                  }}
                  user={currentUser}
                />
              </Stack>
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* Blank toolbar to push content below AppBar */}
          <Box component="main" sx={{ flexGrow: 1,  p: 3 , overflow: 'auto' }}>
            {content}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

