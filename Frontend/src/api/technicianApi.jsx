// src/api/technicianApi.js
import API from './apiClient';

// Get all technicians
export const getAllTechnicians = () => {
  return API.get('/technicians');
};

// Create a new technician
export const createTechnician = (data) => {
  return API.post('/technicians', data);
};

// Get technician by ID
export const getTechnicianById = (id) => {
  return API.get(`/technicians/${id}`);
};

// Update technician info
export const updateTechnician = (id, data) => {
  return API.put(`/technicians/${id}`, data);
};

// Delete technician
export const deleteTechnician = (id) => {
  return API.delete(`/technicians/${id}`);
};
