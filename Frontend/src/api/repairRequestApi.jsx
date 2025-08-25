// repairRequestApi.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/repairs";

export const submitRepairRequest = async (data) => axios.post(BASE_URL, data);
export const getCustomerRequestsById = async (customerId) => axios.get(`${BASE_URL}/dashboard/customer/${customerId}`);
export const updateRepairRequest = async (id, data) => axios.put(`${BASE_URL}/${id}`, data);
export const deleteRepairRequest = async (id) => axios.delete(`${BASE_URL}/${id}`);
export const downloadRepairPDF = async (id) => axios.get(`${BASE_URL}/report/download/${id}`, { responseType: "blob" });
