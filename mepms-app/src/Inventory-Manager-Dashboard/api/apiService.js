// src/api/apiService.js

import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:9090/Inventory-Manager-MS",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAll = (url) => client.get(url);
export const getById = (url, id) => client.get(`${url}/${id}`);
export const createData = (url, data) => client.post(url, data);
export const updateData = (url, id, data) => client.put(`${url}/${id}`, data);
export const deleteData = (url, id) => client.delete(`${url}/${id}`);

export default client;
