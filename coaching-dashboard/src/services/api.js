const API_BASE_URL = 'http://localhost:5000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Coach API functions
export const coachAPI = {
  // Get all coaches
  getAllCoaches: () => apiRequest('/coaches'),
  
  // Get coach by ID
  getCoachById: (id) => apiRequest(`/coaches/${id}`),
  
  // Create new coach
  createCoach: (coachData) => apiRequest('/coaches', {
    method: 'POST',
    body: JSON.stringify(coachData),
  }),
  
  // Update coach
  updateCoach: (id, coachData) => apiRequest(`/coaches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(coachData),
  }),
  
  // Delete coach
  deleteCoach: (id) => apiRequest(`/coaches/${id}`, {
    method: 'DELETE',
  }),
  
  // Search coaches
  searchCoaches: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/coaches/search?${queryString}`);
  },
  
  // Update coach status
  updateCoachStatus: (id, status) => apiRequest(`/coaches/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  
  // Update coach availability
  updateCoachAvailability: (id, availability) => apiRequest(`/coaches/${id}/availability`, {
    method: 'PUT',
    body: JSON.stringify({ availability }),
  }),
};

// User API functions
export const userAPI = {
  // Get all users
  getAllUsers: () => apiRequest('/users'),
  
  // Get user by ID
  getUserById: (id) => apiRequest(`/users/${id}`),
  
  // Create new user
  createUser: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update user
  updateUser: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  // Delete user
  deleteUser: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Session API functions
export const sessionAPI = {
  // Get all sessions
  getAllSessions: () => apiRequest('/sessions'),
  
  // Get sessions by coach
  getSessionsByCoach: (coachId) => apiRequest(`/sessions?coach=${coachId}`),
  
  // Create new session
  createSession: (sessionData) => apiRequest('/sessions', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  }),
  
  // Update session
  updateSession: (id, sessionData) => apiRequest(`/sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sessionData),
  }),
  
  // Delete session
  deleteSession: (id) => apiRequest(`/sessions/${id}`, {
    method: 'DELETE',
  }),
};

// Ground API functions
export const groundAPI = {
  // Get all grounds
  getAllGrounds: () => apiRequest('/grounds'),
  
  // Get ground by ID
  getGroundById: (id) => apiRequest(`/grounds/${id}`),
};

// Test API connection
export const testAPI = () => apiRequest('/test');

export default {
  coachAPI,
  userAPI,
  sessionAPI,
  groundAPI,
  testAPI,
};
