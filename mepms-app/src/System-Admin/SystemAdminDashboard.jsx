import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from '@toolpad/core/Account';

import { DemoProvider } from '@toolpad/core/internal';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function CustomToolbarActions() {
  return (
    <Stack direction="row" alignItems="center">
      <ThemeSwitcher />
    </Stack>
  );
}

function UserTable({ users, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage }) {
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Helper to extract date and time from "Wed Jul 23 11:14:29 IST 2025"
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Example: "Wed Jul 23 11:14:29 IST 2025"
    // Output: "Jul 23 2025, 11:14:29"
    const parts = dateStr.split(' ');
    if (parts.length >= 6) {
      // parts[1]=Jul, parts[2]=23, parts[5]=2025, parts[3]=11:14:29
      return `${parts[1]} ${parts[2]} ${parts[5]}, ${parts[3]}`;
    }
    return dateStr;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 2,
        maxWidth: 900,
        width: '100%',
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 3,
        overflow: 'visible', // prevent scroll
      }}
      elevation={0}
    >
      <Table sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <TableHead>
          <TableRow>
            <TableCell>Employee ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id || user._id}>
              <TableCell>{user.id || user._id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.department}</TableCell>
              <TableCell>{user.roleName}</TableCell>
              <TableCell>
                {formatDate(user.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      />
    </TableContainer>
  );
}

function DemoPageContent({ pathname, users, error }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        bgcolor: 'background.default', // <-- use theme background
        color: 'text.primary',
        boxSizing: 'border-box',
        zIndex: 0,
        pt: 0,
      }}
    >
      <Typography sx={{ mb: 2 }}>Dashboard content for {pathname}</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ width: '100%', maxWidth: 900 }}>
        <UserTable
          users={users}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
  users: PropTypes.array,
  error: PropTypes.string,
};

function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  /**
   * The handler used when the preview is expanded
   */
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  /**
   * The state of the Account popover
   * @default false
   */
  open: PropTypes.bool,
};

const accounts = [
  {
    id: 1,
    name: 'Bharat Kashyap',
    email: 'bharatkashyap@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
    projects: [
      {
        id: 3,
        title: 'Project X',
      },
    ],
  },
  {
    id: 2,
    name: 'Bharat MUI',
    email: 'bharat@mui.com',
    color: '#8B4513', // Brown color
    projects: [{ id: 4, title: 'Project A' }],
  },
];

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Accounts
      </Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{
              justifyContent: 'flex-start',
              width: '100%',
              columnGap: 2,
            }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.95rem',
                  bgcolor: account.color,
                }}
                src={account.image ?? ''}
                alt={account.name ?? ''}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
              primary={account.name}
              secondary={account.email}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

function SidebarFooterAccount({ mini }) {
  const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);
  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: SidebarFooterAccountPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: 'left', vertical: 'bottom' },
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: (theme) =>
                  `drop-shadow(0px 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.32)'})`,
                mt: 1,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
}

SidebarFooterAccount.propTypes = {
  mini: PropTypes.bool.isRequired,
};

const demoSession = {
  user: {
    name: 'Bharat Kashyap',
    email: 'bharatkashyap@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
  },
};

function DashboardLayoutAccountSidebar(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("http://localhost:9090/System-Admin-MS/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch users");
      });
  }, []);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = React.useState(demoSession);
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession(demoSession);
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);

  return (
    // Remove this provider when copying and pasting into your project.
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
        authentication={authentication}
        session={session}
      >
        {/* preview-start */}
        <DashboardLayout
          slots={{
            toolbarActions: CustomToolbarActions,
            sidebarFooter: SidebarFooterAccount,
          }}
        >
          <DemoPageContent pathname={pathname} users={users} error={error} />
        </DashboardLayout>
        {/* preview-end */}
      </AppProvider>
    </DemoProvider>
  );
}

// DashboardLayoutAccountSidebar.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * Remove this when copying and pasting into your project.
//    */
//   window: PropTypes.func,
// };

export default DashboardLayoutAccountSidebar;


