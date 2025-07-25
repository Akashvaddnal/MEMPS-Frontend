// APIEndpoints.js

// Base URLs
const BASE_URL_LOGIN_AUTH = "http://localhost:9090/Login-Auth-MS/api/auth";
const BASE_URL_SYSTEM_ADMIN = "http://localhost:9090/System-Admin-MS/api";

// Login-Auth-MS Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${BASE_URL_LOGIN_AUTH}/register`,
  LOGIN: `${BASE_URL_LOGIN_AUTH}/login`,
};

// User Controller Endpoints
export const USER_ENDPOINTS = {
  CREATE: `${BASE_URL_SYSTEM_ADMIN}/users`,
  GET_ALL: `${BASE_URL_SYSTEM_ADMIN}/users`,
  GET_BY_ID: (id) => `${BASE_URL_SYSTEM_ADMIN}/users/${id}`,
  UPDATE: (id) => `${BASE_URL_SYSTEM_ADMIN}/users/${id}`,
  DELETE: (id) => `${BASE_URL_SYSTEM_ADMIN}/users/${id}`,
};

// Role Controller Endpoints
export const ROLE_ENDPOINTS = {
  CREATE: `${BASE_URL_SYSTEM_ADMIN}/roles`,
  GET_ALL: `${BASE_URL_SYSTEM_ADMIN}/roles`,
  GET_BY_ID: (id) => `${BASE_URL_SYSTEM_ADMIN}/roles/${id}`,
  UPDATE: (id) => `${BASE_URL_SYSTEM_ADMIN}/roles/${id}`,
  DELETE: (id) => `${BASE_URL_SYSTEM_ADMIN}/roles/${id}`,
};

// AuditLog Controller Endpoints
export const AUDIT_LOG_ENDPOINTS = {
  CREATE: `${BASE_URL_SYSTEM_ADMIN}/audit-logs`,
  GET_ALL: `${BASE_URL_SYSTEM_ADMIN}/audit-logs`,
  GET_BY_ID: (id) => `${BASE_URL_SYSTEM_ADMIN}/audit-logs/${id}`,
  GET_BY_USER_ID: (userId) => `${BASE_URL_SYSTEM_ADMIN}/audit-logs/user/${userId}`,
  GET_BY_ACTION: (action) => `${BASE_URL_SYSTEM_ADMIN}/audit-logs/action/${action}`,
  DELETE: (id) => `${BASE_URL_SYSTEM_ADMIN}/audit-logs/${id}`,
};
