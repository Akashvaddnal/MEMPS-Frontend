const BASE_URL = "http://localhost:9090/Biomedical-and-Clinical-Engineer-MS";
const BASE_URL_LOGIN_AUTH = "http://localhost:9090/Login-Auth-MS/api/auth";
export const biomedicalEndpoints = {

  GET_ALL_USAGE_REQUESTS: `${BASE_URL}/api/equipment-usage`,
  GET_USAGE_BY_ID: (id) => `${BASE_URL}/api/equipment-usage/${id}`,
  CREATE_USAGE_REQUEST: `${BASE_URL}/api/equipment-usage`,
  UPDATE_USAGE_REQUEST: (id) => `${BASE_URL}/api/equipment-usage/equipment-usage/${id}`,
  DELETE_USAGE_REQUEST: (id) => `${BASE_URL}/api/equipment-usage/${id}`,

  equipment: {
    getAll: `${BASE_URL}/api/equipment`,
    getById: id => `${BASE_URL}/api/equipment/${id}`,
    create: `${BASE_URL}/api/equipment`,
    update: id => `${BASE_URL}/api/equipment/${id}`,
    delete: id => `${BASE_URL}/api/equipment/${id}`,
  },
  lifecycle: {
    getAll: `${BASE_URL}/api/equipment-lifecycle`,
    getById: id => `${BASE_URL}/api/equipment-lifecycle/${id}`,
    getByEquipmentId: id => `${BASE_URL}/api/equipment-lifecycle/equipment/${id}`,
    create: `${BASE_URL}/api/equipment-lifecycle`,
    update: id => `${BASE_URL}/api/equipment-lifecycle/lifecycle/${id}`,
    delete: id => `${BASE_URL}/api/equipment-lifecycle/${id}`,
  },
  maintenance: {
    getAll: `${BASE_URL}/api/Main-Req/maintenance`,
    getById: id => `${BASE_URL}/api/Main-Req/maintenance/${id}`,
    create: `${BASE_URL}/api/Main-Req/maintenance`,
    update: id => `${BASE_URL}/api/Main-Req/maintenance/${id}`,
    delete: id => `${BASE_URL}/api/Main-Req/maintenance/${id}`,
  },
  departments: {
    getAll: `${BASE_URL}/api/departments`,
    getById: id => `${BASE_URL}/api/departments/${id}`,
  },
  user: {
    current: `${BASE_URL_LOGIN_AUTH}/current`
  }
};
