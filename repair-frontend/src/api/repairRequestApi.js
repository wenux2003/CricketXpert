import axios from "axios";

const BASE_URL = "http://localhost:5000/api/repairs";

// Submit a new repair request
export const submitRepairRequest = async (data) => {
  return await axios.post(`${BASE_URL}`, data);
};

// Get repair requests for a specific customer
export const getCustomerRequestsById = async (customerId) => {
  return await axios.get(`${BASE_URL}/dashboard/customer/${customerId}`);
};

// Update a repair request (general update by customer)
export const updateRepairRequest = async (id, data) => {
  return await axios.put(`${BASE_URL}/${id}`, data);
};

// Delete a repair request
export const deleteRepairRequest = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`);
};

// Download repair report PDF
export const downloadRepairPDF = async (id) => {
  return await axios.get(`${BASE_URL}/report/download/${id}`, { responseType: "blob" });
};
