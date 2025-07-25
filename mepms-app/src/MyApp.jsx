import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios

function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // Optional: capture error

  useEffect(() => {
    // Use Axios to perform GET request
    axios
      .get("http://localhost:9090/System-Admin-MS/api/roles")
      .then((response) => {
        console.log("Fetched users:", response.data); // Debug log
        setUsers(response.data); // Set data to local state
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch users");
      });
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.roleName}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
