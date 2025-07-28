// Base URL
const BASE_URL_INVENTORY_MANAGER = "http://localhost:9090/Inventory-Manager-MS";

// Equipment Endpoints
export const EQUIPMENT_ENDPOINTS = {
  CREATE: `${BASE_URL_INVENTORY_MANAGER}/api/equipment`,
  GET_ALL: `${BASE_URL_INVENTORY_MANAGER}/api/equipment`,
  GET_BY_ID: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/equipment/${id}`,
  GET_BY_SERIAL_NUMBER: (serialNumber) => 
    `${BASE_URL_INVENTORY_MANAGER}/api/equipment/serial-number/${encodeURIComponent(serialNumber)}`,
  GET_BY_CATEGORY: (category) => 
    `${BASE_URL_INVENTORY_MANAGER}/api/equipment/category/${encodeURIComponent(category)}`,
  GET_BY_STATUS: (status) => 
    `${BASE_URL_INVENTORY_MANAGER}/api/equipment/status/${encodeURIComponent(status)}`,
  UPDATE: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/equipment/${id}`,
};

// Equipment LifeCycle Endpoints
export const EQUIPMENT_LIFECYCLE_ENDPOINTS = {
  CREATE: `${BASE_URL_INVENTORY_MANAGER}/api/equipment-lifecycle`,
  GET_ALL: `${BASE_URL_INVENTORY_MANAGER}/api/equipment-lifecycle`,
  GET_BY_ID: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/equipment-lifecycle/${id}`,
  GET_BY_EQUIPMENT_ID: (equipmentId) => 
    `${BASE_URL_INVENTORY_MANAGER}/api/equipment-lifecycle/equipment/${equipmentId}`,
  UPDATE_LIFECYCLE: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/equipment-lifecycle/lifecycle/${id}`,
  DELETE: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/equipment-lifecycle/${id}`,
};

// Equipment Usage Endpoints
export const EQUIPMENT_USAGE_ENDPOINTS = {
  CREATE: `${BASE_URL_INVENTORY_MANAGER}/api/equipment-usage`,
  GET_ALL: `${BASE_URL_INVENTORY_MANAGER}/api/equipment-usage`,
  GET_BY_ID: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/equipment-usage/${id}`,
  GET_BY_EQUIPMENT_ID: (equipmentId) => 
    `${BASE_URL_INVENTORY_MANAGER}/api/equipment-usage/equipment/${equipmentId}`,
  GET_BY_USED_BY: (usedBy) => 
    `${BASE_URL_INVENTORY_MANAGER}/api/equipment-usage/usedby/${encodeURIComponent(usedBy)}`,
  GET_BY_RESERVED_BY: (reservedBy) => 
    `${BASE_URL_INVENTORY_MANAGER}/api/equipment-usage/reservedby/${encodeURIComponent(reservedBy)}`,
  UPDATE_USAGE: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/equipment-usage/equipment-usage/${id}`,
  DELETE: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/equipment-usage/${id}`,
};

// Inventory Audit Endpoints
export const INVENTORY_AUDIT_ENDPOINTS = {
  CREATE: `${BASE_URL_INVENTORY_MANAGER}/api/inventory-audit`,
  GET_ALL: `${BASE_URL_INVENTORY_MANAGER}/api/inventory-audit`,
  GET_BY_ID: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/inventory-audit/${id}`,
  GET_BY_PERFORMED_BY: (performedBy) => 
    `${BASE_URL_INVENTORY_MANAGER}/api/inventory-audit/performedby/${encodeURIComponent(performedBy)}`,
  UPDATE_AUDIT: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/inventory-audit/inventory-audit/${id}`,
  DELETE: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/inventory-audit/${id}`,
};

// Maintenance Request Endpoints
export const MAINTENANCE_REQUEST_ENDPOINTS = {
  CREATE: `${BASE_URL_INVENTORY_MANAGER}/api/Main-Req/maintenance`,
  GET_ALL: `${BASE_URL_INVENTORY_MANAGER}/api/Main-Req/maintenance`,
  GET_BY_ID: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/Main-Req/maintenance/${id}`,
  UPDATE: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/Main-Req/maintenance/${id}`,
  DELETE: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/Main-Req/maintenance/${id}`,
};

// Stock Levels Endpoints
export const STOCK_LEVELS_ENDPOINTS = {
  CREATE: `${BASE_URL_INVENTORY_MANAGER}/api/stock-levels`,
  GET_ALL: `${BASE_URL_INVENTORY_MANAGER}/api/stock-levels`,
  GET_BY_ID: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/stock-levels/${id}`,
  GET_BY_EQUIPMENT_ID: (equipmentId) => 
    `${BASE_URL_INVENTORY_MANAGER}/api/stock-levels/equipment/${equipmentId}`,
  UPDATE_STOCK: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/stock-levels/stock-levels/${id}`,
  DELETE: (id) => `${BASE_URL_INVENTORY_MANAGER}/api/stock-levels/${id}`,
};