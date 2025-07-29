import axios from "axios";
import {jwtDecode} from "jwt-decode";

export async function fetchCurrentUser() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // Optional: decoded.sub, decoded.email, decoded.role etc.
    const res = await axios.get("http://localhost:9090/Login-Auth-MS/api/auth/current", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Current User:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching current user", err);
    return null;
  }
}
