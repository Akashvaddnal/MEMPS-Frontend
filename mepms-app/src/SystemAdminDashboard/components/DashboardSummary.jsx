// import React from 'react';
// import PropTypes from 'prop-types';
// import { Box, Grid, Paper, Typography, Button } from '@mui/material';

// export default function DashboardSummary({ users, roles, logs }) {
//   const totalUsers = users.length;
//   const totalRoles = roles.length;
//   const totalLogs = logs.length;

//   const userCreationToday = users.filter(user => {
//     if (!user.createdAt) return false;
//     const created = new Date(user.createdAt);
//     const today = new Date();
//     return (
//       created.getDate() === today.getDate() &&
//       created.getMonth() === today.getMonth() &&
//       created.getFullYear() === today.getFullYear()
//     );
//   }).length;

//   return (
//     <Box>
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Paper sx={{ p: 2, textAlign: 'center' }}>
//             <Typography variant="h6">Total Users</Typography>
//             <Typography variant="h4">{totalUsers}</Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Paper sx={{ p: 2, textAlign: 'center' }}>
//             <Typography variant="h6">Total Roles</Typography>
//             <Typography variant="h4">{totalRoles}</Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Paper sx={{ p: 2, textAlign: 'center' }}>
//             <Typography variant="h6">Total Audit Logs</Typography>
//             <Typography variant="h4">{totalLogs}</Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Paper sx={{ p: 2, textAlign: 'center' }}>
//             <Typography variant="h6">Users Created Today</Typography>
//             <Typography variant="h4">{userCreationToday}</Typography>
//           </Paper>
//         </Grid>
//       </Grid>
//       <Box sx={{ mt: 3, textAlign: 'center' }}>
//         <Button variant="contained" onClick={() => alert('Downloading full report...')}>
//           Download Full Report
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// DashboardSummary.propTypes = {
//   users: PropTypes.array.isRequired,
//   roles: PropTypes.array.isRequired,
//   logs: PropTypes.array.isRequired,
// };



import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Paper, Typography, Button, useTheme, Stack } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import BadgeIcon from '@mui/icons-material/Badge';
import HistoryIcon from '@mui/icons-material/History';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function DashboardSummary({ users, roles, logs }) {
  const theme = useTheme();

  const totalUsers = users.length;
  const totalRoles = roles.length;
  const totalLogs = logs.length;

  const userCreationToday = users.filter((user) => {
    if (!user.createdAt) return false;
    const created = new Date(user.createdAt);
    const today = new Date();
    return (
      created.getDate() === today.getDate() &&
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear()
    );
  }).length;

  // Helper to format number with commas
  const formatNumber = (num) => num.toLocaleString();

  const cardData = [
    {
      label: 'Total Users',
      value: formatNumber(totalUsers),
      icon: <GroupIcon sx={{ fontSize: 42, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Total Roles',
      value: formatNumber(totalRoles),
      icon: <BadgeIcon sx={{ fontSize: 42, color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
    },
    {
      label: 'Total Audit Logs',
      value: formatNumber(totalLogs),
      icon: <HistoryIcon sx={{ fontSize: 42, color: theme.palette.warning.main }} />,
      color: theme.palette.warning.main,
    },
    {
      label: 'Users Created Today',
      value: formatNumber(userCreationToday),
      icon: <PersonAddIcon sx={{ fontSize: 42, color: theme.palette.info.main }} />,
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', p: 2 }}>
  <Grid container spacing={3}>
    {cardData.map(({ label, value, icon, color }) => (
      <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={label}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 16px ${theme.palette.action.hover}`,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box sx={{ mr: 3 }}>{icon}</Box>
              <Stack>
                <Typography
                  variant="subtitle2"
                  sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 0.5 }}
                >
                  {label}
                </Typography>
                <Typography variant="h4" sx={{ color, fontWeight: 'bold', letterSpacing: '0.02em' }}>
                  {value}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 5, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
          onClick={() => alert('Downloading full report...')}
          disableElevation
        >
          Download Full Report
        </Button>
      </Box>
    </Box>
  );
}

DashboardSummary.propTypes = {
  users: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  logs: PropTypes.array.isRequired,
};
