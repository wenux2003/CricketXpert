import axios from "axios";

const BASE_URL = "http://localhost:5000/api/repairs";

// Submit a new repair request
export const submitRepairRequest = (data) => axios.post(`${BASE_URL}`, data);

// Get repair requests for a customer
export const getCustomerRequestsById = (customerId) =>
  axios.get(`${BASE_URL}/dashboard/customer/${customerId}`);

// Update a repair request
export const updateRepairRequest = (id, data) =>
  axios.put(`${BASE_URL}/${id}`, data);

// Delete a repair request
export const deleteRepairRequest = (id) =>
  axios.delete(`${BASE_URL}/${id}`);

// Download repair report PDF
export const downloadRepairPDF = (id) =>
  axios.get(`${BASE_URL}/report/download/${id}`, { responseType: "blob" });


export const getAllRepairRequests = (params) => API.get('/repairs/dashboard/manager', { params });
export const updateRequestStatus = (id, payload) => API.put(`/repairs/status/${id}`, payload);
export const assignTechnician = (id, payload) => API.put(`/repairs/assign/${id}`, payload);
export const customerDecision = (id, payload) => API.put(`/repairs/customer-decision/${id}`, payload);
export const updateProgress = (id, payload) => API.put(`/repairs/progress/${id}`, payload);
export const getTechnicianRequests = (technicianId) => API.get(`/repairs/dashboard/technician/${technicianId}`);

