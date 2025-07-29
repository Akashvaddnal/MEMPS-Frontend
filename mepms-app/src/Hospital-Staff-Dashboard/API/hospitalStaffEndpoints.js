const BASE_URL = "http://localhost:9090/Hospital-Staff-MS";

export const STAFF_ENDPOINTS = {
  GET_ALL_DEPARTMENTS: `${BASE_URL}/api/departments`,
  GET_DEPARTMENT_BY_ID: (id) => `${BASE_URL}/api/departments/${id}`,

  GET_ALL_EQUIPMENT: `${BASE_URL}/api/equipment`,
  GET_EQUIPMENT_BY_ID: (id) => `${BASE_URL}/api/equipment/${id}`,
  SEARCH_EQUIPMENT_BY_DEPARTMENT: (deptName) =>
    `${BASE_URL}/api/equipment/department/${encodeURIComponent(deptName)}`,

  GET_ALL_MAINTENANCE_REQUESTS: `${BASE_URL}/api/Main-Req/maintenance`,
  GET_MAINTENANCE_BY_ID: (id) => `${BASE_URL}/api/Main-Req/maintenance/${id}`,
  CREATE_MAINTENANCE_REQUEST: `${BASE_URL}/api/Main-Req/maintenance`,
  UPDATE_MAINTENANCE_REQUEST: (id) => `${BASE_URL}/api/Main-Req/maintenance/${id}`,
  DELETE_MAINTENANCE_REQUEST: (id) => `${BASE_URL}/api/Main-Req/maintenance/${id}`,

  GET_ALL_USAGE_REQUESTS: `${BASE_URL}/api/equipment-usage`,
  GET_USAGE_BY_ID: (id) => `${BASE_URL}/api/equipment-usage/${id}`,
  CREATE_USAGE_REQUEST: `${BASE_URL}/api/equipment-usage`,
  UPDATE_USAGE_REQUEST: (id) => `${BASE_URL}/api/equipment-usage/equipment-usage/${id}`,
  DELETE_USAGE_REQUEST: (id) => `${BASE_URL}/api/equipment-usage/${id}`,

  GET_CURRENT_USER: `${BASE_URL}/api/auth/current`,

  SEARCH_DEPARTMENT_EQUIPMENTS: (deptName) =>
  `${BASE_URL}/api/departments/equipment/department/${encodeURIComponent(deptName)}`,
};
