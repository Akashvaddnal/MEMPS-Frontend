// import React from "react";
// import EquipmentUsageRequests from "../Components/dashboard/EquipmentUsageRequests";

// const EquipmentUsageRequestPage = () => {
//   return <EquipmentUsageRequests />;
// };

// export default EquipmentUsageRequestPage;


import React from "react";
import EquipmentUsageRequests from "../Components/dashboard/EquipmentUsageRequests";
import { fetchCurrentUser } from "../utils/auth";
import { useState, useEffect } from "react";  



const EquipmentUsageRequestPage = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await fetchCurrentUser();
       
        setCurrentUser(user);
      } catch (error) {
        console.error("ERROR loading current user:", error);
      }
    }
    loadUser();
  }, []);
  return <EquipmentUsageRequests currentUser={currentUser} />;
};



export default EquipmentUsageRequestPage;
