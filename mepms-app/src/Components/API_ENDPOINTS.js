const BASE_URL = "http://localhost:9090/Procurement-Officer-MS/api";

export const EQUIPMENT_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/equipment`,
  GET_BY_ID: (id) => `${BASE_URL}/equipment/${id}`,
  CREATE: `${BASE_URL}/equipment`,
  UPDATE: (id) => `${BASE_URL}/equipment/${id}`,
  DELETE: (id) => `${BASE_URL}/equipment/${id}`,
  GET_BY_STATUS: (status) => `${BASE_URL}/equipment/status/${status}`,
};

export const VENDOR_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/vendors`,
  GET_BY_ID: (id) => `${BASE_URL}/vendors/${id}`,
  CREATE: `${BASE_URL}/vendors`,
  UPDATE: (id) => `${BASE_URL}/vendors/${id}`,
  DELETE: (id) => `${BASE_URL}/vendors/${id}`,
};

export const PURCHASE_ORDER_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/purchase-orders`,
  GET_BY_ID: (id) => `${BASE_URL}/purchase-orders/${id}`,
  CREATE: `${BASE_URL}/purchase-orders`,
  UPDATE: (id) => `${BASE_URL}/purchase-orders/${id}`,
  DELETE: (id) => `${BASE_URL}/purchase-orders/${id}`,
  GET_BY_STATUS: (status) => `${BASE_URL}/purchase-orders/status/${status}`,
};

export const STOCK_LEVEL_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/stock-levels`,
  GET_BY_EQUIPMENT_ID: (id) => `${BASE_URL}/stock-levels/equipment/${id}`,
  BELOW_MINIMUM: `${BASE_URL}/stock-levels/alerts/below-minimum`,
  UPDATE: (id) => `${BASE_URL}/stock-levels/${id}`,
};

export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/notifications`,
  MARK_AS_READ: (id) => `${BASE_URL}/notifications/${id}/read`,
};