// import React, { useEffect, useState } from "react";
// import { Grid, Typography, Box } from "@mui/material";
// import axios from "axios";
// import { STAFF_ENDPOINTS } from "../../API/hospitalStaffEndpoints";
// import EquipmentCard from "./EquipmentCard";

// // Dashboard showing equipment cards filtered by logged-in user department
// const Dashboard = ({ userDepartment }) => {
//   const [equipmentList, setEquipmentList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function fetchEquipments() {
//       setLoading(true);
//       try {
//         if (userDepartment) {
//           // Assuming backend supports search by department
//           const res = await axios.get(STAFF_ENDPOINTS.SEARCH_EQUIPMENT_BY_DEPARTMENT(userDepartment));
//           setEquipmentList(res.data || []);
//         } else {
//           // fallback: get all equipment
//           const res = await axios.get(STAFF_ENDPOINTS.GET_ALL_EQUIPMENT);
//           setEquipmentList(res.data || []);
//         }
//       } catch {
//         setEquipmentList([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchEquipments();
//   }, [userDepartment]);

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" gutterBottom>
//         Equipment for Department: {userDepartment || "All Departments"}
//       </Typography>
//       {loading ? (
//         <Typography>Loading...</Typography>
//       ) : equipmentList.length === 0 ? (
//         <Typography>No equipment found.</Typography>
//       ) : (
//         <Grid container spacing={2}>
//           {equipmentList.map((eq) => (
//             <Grid item xs={12} sm={6} md={4} key={eq.id || eq._id}>
//               <EquipmentCard equipment={eq} />
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { STAFF_ENDPOINTS } from "../../API/hospitalStaffEndpoints";
import EquipmentCard from "./EquipmentCard";

// Dashboard showing equipment cards filtered by logged-in user's department, and passes currentUser to each card
const Dashboard = ({ userDepartment, currentUser }) => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEquipments() {
      setLoading(true);
      try {
        if (userDepartment) {
          const res = await axios.get(
            STAFF_ENDPOINTS.SEARCH_DEPARTMENT_EQUIPMENTS(userDepartment)
          );
          setEquipmentList(res.data || []);
        } else {
          const res = await axios.get(STAFF_ENDPOINTS.GET_ALL_EQUIPMENT);
          setEquipmentList(res.data || []);
        }
      } catch {
        setEquipmentList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEquipments();
  }, [userDepartment]);


  return (
    <Box sx={{ p: 3 , mt:-14, ml:-3}}>
      <Typography variant="h5" gutterBottom>
        Equipment for Department: {userDepartment || "All Departments"}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : equipmentList.length === 0 ? (
        <Typography>No equipment found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {equipmentList.map((eq) => (
            <Grid item xs={12} sm={6} md={4} key={eq.id || eq._id}>
              <EquipmentCard equipment={eq} currentUser={currentUser} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
