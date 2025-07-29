const BASE_URL = "http://localhost:9090/Biomedical-and-Clinical-Engineer-MS";

export const biomedicalEndpoints = {
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
    current: `${BASE_URL}/api/auth/current`
  }
};
