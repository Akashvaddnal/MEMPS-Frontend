import axios from "axios";
import {jwtDecode} from "jwt-decode";

export async function fetchCurrentUser() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    // Optional: decode token for info
    jwtDecode(token);
    const res = await axios.get("http://localhost:9090/Login-Auth-MS/api/auth/current", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error("fetchCurrentUser error:", error);
    return null;
  }
}
