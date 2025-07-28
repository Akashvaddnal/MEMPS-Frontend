// src/api/endpoints.js

const BASE_URL = "http://localhost:9090/Inventory-Manager-MS";

export const EQUIPMENT_ENDPOINTS = {
  CREATE: `${BASE_URL}/api/equipment`,
  GET_ALL: `${BASE_URL}/api/equipment`,
  GET_BY_ID: (id) => `${BASE_URL}/api/equipment/${id}`,
  UPDATE: (id) => `${BASE_URL}/api/equipment/${id}`,
  DELETE: (id) => `${BASE_URL}/api/equipment/${id}`,
};

export const EQUIPMENT_LIFECYCLE_ENDPOINTS = {
  CREATE: `${BASE_URL}/api/equipment-lifecycle`,
  GET_ALL: `${BASE_URL}/api/equipment-lifecycle`,
  GET_BY_ID: (id) => `${BASE_URL}/api/equipment-lifecycle/${id}`,
  UPDATE: (id) => `${BASE_URL}/api/equipment-lifecycle/lifecycle/${id}`,
  DELETE: (id) => `${BASE_URL}/api/equipment-lifecycle/${id}`,
};

export const EQUIPMENT_USAGE_ENDPOINTS = {
  CREATE: `${BASE_URL}/api/equipment-usage`,
  GET_ALL: `${BASE_URL}/api/equipment-usage`,
  GET_BY_ID: (id) => `${BASE_URL}/api/equipment-usage/${id}`,
  GET_BY_EQUIPMENT_ID: (equipmentId) => 
    `${BASE_URL}/api/equipment-usage/equipment/${equipmentId}`,
  GET_BY_USED_BY: (usedBy) => 
    `${BASE_URL}/api/equipment-usage/usedby/${encodeURIComponent(usedBy)}`,
  GET_BY_RESERVED_BY: (reservedBy) => 
    `${BASE_URL}/api/equipment-usage/reservedby/${encodeURIComponent(reservedBy)}`,
  UPDATE_USAGE: (id) => `${BASE_URL}/api/equipment-usage/equipment-usage/${id}`,
  DELETE: (id) => `${BASE_URL}/api/equipment-usage/${id}`,
};

export const INVENTORY_AUDIT_ENDPOINTS = {
  CREATE: `${BASE_URL}/api/inventory-audit`,
  GET_ALL: `${BASE_URL}/api/inventory-audit`,
  GET_BY_ID: (id) => `${BASE_URL}/api/inventory-audit/${id}`,
  UPDATE: (id) => `${BASE_URL}/api/inventory-audit/inventory-audit/${id}`,
  DELETE: (id) => `${BASE_URL}/api/inventory-audit/${id}`,
};

export const MAINTENANCE_REQUEST_ENDPOINTS = {
  CREATE: `${BASE_URL}/api/Main-Req/maintenance`,
  GET_ALL: `${BASE_URL}/api/Main-Req/maintenance`,
  GET_BY_ID: (id) => `${BASE_URL}/api/Main-Req/maintenance/${id}`,
  UPDATE: (id) => `${BASE_URL}/api/Main-Req/maintenance/${id}`,
  DELETE: (id) => `${BASE_URL}/api/Main-Req/maintenance/${id}`,
};

export const STOCK_LEVELS_ENDPOINTS = {
  CREATE: `${BASE_URL}/api/stock-levels`,
  GET_ALL: `${BASE_URL}/api/stock-levels`,
  GET_BY_ID: (id) => `${BASE_URL}/api/stock-levels/${id}`,
  UPDATE: (id) => `${BASE_URL}/api/stock-levels/stock-levels/${id}`,
  DELETE: (id) => `${BASE_URL}/api/stock-levels/${id}`,
};
