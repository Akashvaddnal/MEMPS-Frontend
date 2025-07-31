// import React from 'react';
// import { Card, Typography, Box, Stack, useTheme } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
// import PendingActionsIcon from '@mui/icons-material/PendingActions';

// // Map label keys to icons or pass icon as prop for more flexibility
// const iconMap = {
//   Pending: <PendingActionsIcon fontSize="large" color="warning" />,
//   Accepted: <AssignmentTurnedInIcon fontSize="large" color="info" />,
//   "In Progress": <HourglassEmptyIcon fontSize="large" color="primary" />,
//   Resolved: <CheckCircleIcon fontSize="large" color="success" />,
// };

// function StatsCard({ label, value, color }) {
//   const theme = useTheme();

//   return (
//     <Card
//       sx={{
//         p: 2,
//         m: 1,
//         flex: '1 1 200px',
//         position: 'relative',
//         borderRadius: 2,
//         boxShadow: 3,
//         bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
//         transition: 'transform 0.3s',
//         '&:hover': {
//           transform: 'scale(1.05)',
//           boxShadow: 6,
//         },
//       }}
//       raised
//     >
//       <Stack direction="row" alignItems="center" spacing={2} mb={1}>
//         <Box
//           sx={{
//             bgcolor: color ? color : (theme.palette.primary.main),
//             borderRadius: '50%',
//             width: 40,
//             height: 40,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             color: 'white',
//             boxShadow: '0 0 8px rgba(0,0,0,0.2)',
//           }}
//         >
//           {iconMap[label] || iconMap['Pending']}
//         </Box>
//         <Typography variant="subtitle1" fontWeight={600}>
//           {label}
//         </Typography>
//       </Stack>
//       <Typography variant="h4" fontWeight={700} color={color || 'primary'}>
//         {value}
//       </Typography>
//     </Card>
//   );
// }

// export default StatsCard;


import React from 'react';
import { Card, Typography, Box, Stack, useTheme } from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

// Map status label to a specific icon and background color
const statusMeta = {
  Pending: {
    icon: <PendingActionsIcon fontSize="large" />,
    bg: "#ffb300"
  },
  Accepted: {
    icon: <AssignmentTurnedInIcon fontSize="large" />,
    bg: "#0288d1"
  },
  "In Progress": {
    icon: <HourglassBottomIcon fontSize="large" />,
    bg: "#1976d2"
  },
  Resolved: {
    icon: <TaskAltIcon fontSize="large" />,
    bg: "#43a047"
  },
};

export default function StatsCard({ label, value, color }) {
  const theme = useTheme();
  const meta = statusMeta[label] || {};
  return (
    <Card
      sx={{
        p: 2,
        m: 1,
        minWidth: 210,
        borderRadius: 3,
        boxShadow: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        bgcolor: theme.palette.mode === "dark" ? "background.paper" : "grey.50",
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 10,
        }
      }}
      raised
    >
      <Stack direction="row" alignItems="center" spacing={2} mb={1}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: meta.bg || color || theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: "#fff",
            boxShadow: 1
          }}
        >
          {meta.icon}
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="h4" fontWeight="bold" color={meta.bg || color || "primary"}>
        {value}
      </Typography>
    </Card>
  );
}
