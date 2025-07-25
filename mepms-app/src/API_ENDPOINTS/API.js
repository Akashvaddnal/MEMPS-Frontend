// // APIEndpoints.js

// // Base URLs
// const BASE_URL_LOGIN_AUTH = "http://localhost:9090/Login-Auth-MS/api/auth";
// const BASE_URL_SYSTEM_ADMIN = "http://localhost:9090/System-Admin-MS/api";


// // Login-Auth-MS Endpoints
// export const AUTH_ENDPOINTS = {
//   REGISTER: `${BASE_URL_LOGIN_AUTH}/register`,
//   LOGIN: `${BASE_URL_LOGIN_AUTH}/login`,
// };

// // User Controller Endpoints
// export const USER_ENDPOINTS = {
//   CREATE: `${BASE_URL_SYSTEM_ADMIN}/users`,
//   GET_ALL: `${BASE_URL_SYSTEM_ADMIN}/users`,
//   GET_BY_ID: (id) => `${BASE_URL_SYSTEM_ADMIN}/users/${id}`,
//   UPDATE: (id) => `${BASE_URL_SYSTEM_ADMIN}/users/${id}`,
//   DELETE: (id) => `${BASE_URL_SYSTEM_ADMIN}/users/${id}`,
// };

// // Role Controller Endpoints
// export const ROLE_ENDPOINTS = {
//   CREATE: `${BASE_URL_SYSTEM_ADMIN}/roles`,
//   GET_ALL: `${BASE_URL_SYSTEM_ADMIN}/roles`,
//   GET_BY_ID: (id) => `${BASE_URL_SYSTEM_ADMIN}/roles/${id}`,
//   UPDATE: (id) => `${BASE_URL_SYSTEM_ADMIN}/roles/${id}`,
//   DELETE: (id) => `${BASE_URL_SYSTEM_ADMIN}/roles/${id}`,
// };

// // AuditLog Controller Endpoints
// export const AUDIT_LOG_ENDPOINTS = {
//   CREATE: `${BASE_URL_SYSTEM_ADMIN}/audit-logs`,
//   GET_ALL: `${BASE_URL_SYSTEM_ADMIN}/audit-logs`,
//   GET_BY_ID: (id) => `${BASE_URL_SYSTEM_ADMIN}/audit-logs/${id}`,
//   GET_BY_USER_ID: (userId) => `${BASE_URL_SYSTEM_ADMIN}/audit-logs/user/${userId}`,
//   GET_BY_ACTION: (action) => `${BASE_URL_SYSTEM_ADMIN}/audit-logs/action/${action}`,
//   DELETE: (id) => `${BASE_URL_SYSTEM_ADMIN}/audit-logs/${id}`,
// };



// APIEndpoints.js


// Base URLs
const BASE_URL_LOGIN_AUTH = "http://localhost:9090/Login-Auth-MS/api/auth";
const BASE_URL_SYSTEM_ADMIN = "http://localhost:9090/System-Admin-MS/api";
const BASE_URL_PROCUREMENT_OFFICER = "http://localhost:9090/Procurement-Officer-MS/api";


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
  GET_CURRENT: `${BASE_URL_SYSTEM_ADMIN}/users/current`,
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


// Procurement-Officer-MS Endpoints for all entities

// Vendors
export const VENDOR_ENDPOINTS = {
  CREATE: `${BASE_URL_PROCUREMENT_OFFICER}/vendors`,
  GET_ALL: `${BASE_URL_PROCUREMENT_OFFICER}/vendors`,
  GET_BY_ID: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/vendors/${id}`,
  GET_BY_EMAIL: (email) => `${BASE_URL_PROCUREMENT_OFFICER}/vendors/email/${encodeURIComponent(email)}`,
  GET_BY_NAME: (name) => `${BASE_URL_PROCUREMENT_OFFICER}/vendors/name/${encodeURIComponent(name)}`,
  UPDATE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/vendors/${id}`,
  DELETE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/vendors/${id}`,
  COUNT: `${BASE_URL_PROCUREMENT_OFFICER}/vendors/count`,
};

// Purchase Orders
export const PURCHASE_ORDER_ENDPOINTS = {
  CREATE: `${BASE_URL_PROCUREMENT_OFFICER}/purchase-orders`,
  GET_ALL: `${BASE_URL_PROCUREMENT_OFFICER}/purchase-orders`,
  GET_BY_ID: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-orders/${id}`,
  GET_BY_PO_NUMBER: (poNumber) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-orders/po-number/${encodeURIComponent(poNumber)}`,
  GET_BY_VENDOR_ID: (vendorId) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-orders/vendor/${vendorId}`,
  GET_BY_STATUS: (status) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-orders/status/${encodeURIComponent(status)}`,
  UPDATE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-orders/${id}`,
  DELETE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-orders/${id}`,
  // Reports
  TOTAL_AMOUNT_BY_VENDOR: (vendorId) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-orders/reports/total-amount/vendor/${vendorId}`,
};

// Purchase Order Items
export const PURCHASE_ORDER_ITEM_ENDPOINTS = {
  CREATE: `${BASE_URL_PROCUREMENT_OFFICER}/purchase-order-items`,
  GET_ALL: `${BASE_URL_PROCUREMENT_OFFICER}/purchase-order-items`,
  GET_BY_ID: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-order-items/${id}`,
  GET_BY_PO_ID: (poId) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-order-items/po/${poId}`,
  GET_BY_EQUIPMENT_ID: (equipmentId) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-order-items/equipment/${equipmentId}`,
  UPDATE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-order-items/${id}`,
  DELETE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/purchase-order-items/${id}`,
};

// Notifications
export const NOTIFICATION_ENDPOINTS = {
  CREATE: `${BASE_URL_PROCUREMENT_OFFICER}/notifications`,
  GET_ALL: `${BASE_URL_PROCUREMENT_OFFICER}/notifications`,
  GET_BY_ID: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/notifications/${id}`,
  GET_BY_RECIPIENT_ID: (recipientId) => `${BASE_URL_PROCUREMENT_OFFICER}/notifications/recipient/${recipientId}`,
  GET_UNREAD_BY_RECIPIENT: (recipientId) => `${BASE_URL_PROCUREMENT_OFFICER}/notifications/recipient/${recipientId}/unread`,
  UPDATE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/notifications/${id}`,
  MARK_AS_READ: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/notifications/${id}/read`,
  DELETE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/notifications/${id}`,
};

// Equipment
export const EQUIPMENT_ENDPOINTS = {
  CREATE: `${BASE_URL_PROCUREMENT_OFFICER}/equipment`,
  GET_ALL: `${BASE_URL_PROCUREMENT_OFFICER}/equipment`,
  GET_BY_ID: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment/${id}`,
  GET_BY_SERIAL_NUMBER: (serialNumber) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment/serial-number/${encodeURIComponent(serialNumber)}`,
  GET_BY_CATEGORY: (category) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment/category/${encodeURIComponent(category)}`,
  GET_BY_STATUS: (status) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment/status/${encodeURIComponent(status)}`,
  GET_BY_VENDOR_ID: (vendorId) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment/vendor/${vendorId}`,
  UPDATE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment/${id}`,
  DELETE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment/${id}`,
};

// Equipment Lifecycle
export const EQUIPMENT_LIFECYCLE_ENDPOINTS = {
  CREATE: `${BASE_URL_PROCUREMENT_OFFICER}/equipment-lifecycle`,
  GET_BY_ID: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment-lifecycle/${id}`,
  GET_BY_EQUIPMENT_ID: (equipmentId) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment-lifecycle/equipment/${equipmentId}`,
  UPDATE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment-lifecycle/${id}`,
  DELETE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment-lifecycle/${id}`,
  // Reports
  TOTAL_MAINTENANCE_COST_BY_EQUIPMENT: (equipmentId) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment-lifecycle/reports/total-maintenance-cost/${equipmentId}`,
  MAINTENANCE_COUNT_BY_EQUIPMENT: (equipmentId) => `${BASE_URL_PROCUREMENT_OFFICER}/equipment-lifecycle/reports/maintenance-count/${equipmentId}`,
};

// Stock Levels
export const STOCK_LEVEL_ENDPOINTS = {
  CREATE: `${BASE_URL_PROCUREMENT_OFFICER}/stock-levels`,
  GET_ALL: `${BASE_URL_PROCUREMENT_OFFICER}/stock-levels`,
  GET_BY_EQUIPMENT_ID: (equipmentId) => `${BASE_URL_PROCUREMENT_OFFICER}/stock-levels/equipment/${equipmentId}`,
  UPDATE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/stock-levels/${id}`,
  DELETE: (id) => `${BASE_URL_PROCUREMENT_OFFICER}/stock-levels/${id}`,
  // Alerts
  BELOW_MINIMUM: `${BASE_URL_PROCUREMENT_OFFICER}/stock-levels/alerts/below-minimum`,
};
