import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || `Server Error: ${error.response.status}`;
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:5000');
    } else {
      // Something else happened
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
);

// Coaching Programs API
export const programsAPI = {
  // Get all programs
  getAll: (params = {}) => {
    return api.get('/programs', { params });
  },

  // Get single program by ID
  getById: (id) => {
    return api.get(`/programs/${id}`);
  },

  // Get programs by coach
  getByCoach: (coachId, params = {}) => {
    return api.get(`/programs/coach/${coachId}`, { params });
  },

  // Create new program (coach only)
  create: (programData) => {
    return api.post('/programs', programData);
  },

  // Update program (coach only)
  update: (id, programData) => {
    return api.put(`/programs/${id}`, programData);
  },

  // Delete program (coach only)
  delete: (id) => {
    return api.delete(`/programs/${id}`);
  },

  // Add material to program
  addMaterial: (id, materialData) => {
    return api.post(`/programs/${id}/materials`, materialData);
  },

  // Get program statistics
  getStats: (id) => {
    return api.get(`/programs/${id}/stats`);
  }
};

// Enrollments API
export const enrollmentsAPI = {
  // Get all enrollments (admin only)
  getAll: (params = {}) => {
    return api.get('/enrollments', { params });
  },

  // Get single enrollment
  getById: (id) => {
    return api.get(`/enrollments/${id}`);
  },

  // Create enrollment
  create: (enrollmentData) => {
    return api.post('/enrollments', enrollmentData);
  },

  // Update enrollment
  update: (id, updateData) => {
    return api.put(`/enrollments/${id}`, updateData);
  },

  // Cancel enrollment
  cancel: (id) => {
    return api.delete(`/enrollments/${id}`);
  },

  // Get user enrollments
  getUserEnrollments: (userId, params = {}) => {
    return api.get(`/enrollments/user/${userId}`, { params });
  },

  // Update progress (coach only)
  updateProgress: (id, progressData) => {
    return api.put(`/enrollments/${id}/progress`, progressData);
  },

  // Add feedback
  addFeedback: (id, feedbackData) => {
    return api.post(`/enrollments/${id}/feedback`, feedbackData);
  },

  // Get enrollment stats for program
  getProgramStats: (programId) => {
    return api.get(`/enrollments/program/${programId}/stats`);
  }
};

// Sessions API
export const sessionsAPI = {
  // Get all sessions
  getAll: (params = {}) => {
    return api.get('/sessions', { params });
  },

  // Get single session
  getById: (id) => {
    return api.get(`/sessions/${id}`);
  },

  // Create session (coach only)
  create: (sessionData) => {
    return api.post('/sessions', sessionData);
  },

  // Update session (coach only)
  update: (id, sessionData) => {
    return api.put(`/sessions/${id}`, sessionData);
  },

  // Cancel session (coach only)
  cancel: (id) => {
    return api.delete(`/sessions/${id}`);
  },

  // Add participant to session
  addParticipant: (id, participantData) => {
    return api.post(`/sessions/${id}/participants`, participantData);
  },

  // Mark attendance (coach only)
  markAttendance: (id, attendanceData) => {
    return api.put(`/sessions/${id}/attendance`, attendanceData);
  },

  // Get sessions by program
  getByProgram: (programId, params = {}) => {
    return api.get(`/sessions/program/${programId}`, { params });
  },

  // Get sessions by coach
  getByCoach: (coachId, params = {}) => {
    return api.get(`/sessions/coach/${coachId}`, { params });
  },

  // Get ground availability
  getGroundAvailability: (groundId, params = {}) => {
    return api.get(`/sessions/ground/${groundId}/availability`, { params });
  },

  // Book session (add participant)
  bookSession: (sessionData) => {
    return api.post('/sessions/book', sessionData);
  },

  // Cancel session booking
  cancelBooking: (bookingId) => {
    return api.delete(`/sessions/bookings/${bookingId}`);
  },

  // Reschedule session booking
  rescheduleBooking: (bookingId, newSessionData) => {
    return api.put(`/sessions/bookings/${bookingId}/reschedule`, newSessionData);
  },

  // Get user's booked sessions
  getUserBookedSessions: (userId, params = {}) => {
    return api.get(`/sessions/user/${userId}/bookings`, { params });
  },

  // Get available sessions for a program
  getAvailableSessionsForProgram: (programId, params = {}) => {
    return api.get(`/sessions/program/${programId}/available`, { params });
  },

  // Get grounds list
  getGrounds: () => {
    return api.get('/grounds');
  }
};

// Users API
export const usersAPI = {
  // Get all users (admin only)
  getAll: (params = {}) => {
    return api.get('/users', { params });
  },

  // Get single user
  getById: (id) => {
    return api.get(`/users/${id}`);
  },

  // Create user
  create: (userData) => {
    return api.post('/users', userData);
  },

  // Update user
  update: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },

  // Delete user (admin only)
  delete: (id) => {
    return api.delete(`/users/${id}`);
  },

  // Change password
  changePassword: (id, passwordData) => {
    return api.put(`/users/${id}/password`, passwordData);
  },

  // Get users by role
  getByRole: (role, params = {}) => {
    return api.get(`/users/role/${role}`, { params });
  },

  // Get user statistics (admin only)
  getStats: () => {
    return api.get('/users/stats/overview');
  },

  // Toggle user status (admin only)
  toggleStatus: (id, statusData) => {
    return api.put(`/users/${id}/status`, statusData);
  },

  // Register new user (public)
  register: (userData) => {
    return api.post('/users/register', userData);
  }
};

// Payments API
export const paymentsAPI = {
  // Create payment intent
  createPaymentIntent: (paymentData) => {
    return api.post('/payments/create-intent', paymentData);
  },

  // Confirm payment
  confirmPayment: (paymentIntentId, paymentData) => {
    return api.post(`/payments/confirm/${paymentIntentId}`, paymentData);
  },

  // Get user payments
  getUserPayments: (userId, params = {}) => {
    return api.get(`/payments/user/${userId}`, { params });
  },

  // Get payment by ID
  getById: (id) => {
    return api.get(`/payments/${id}`);
  },

  // Download payment receipt
  downloadReceipt: (paymentId) => {
    return api.get(`/payments/${paymentId}/receipt`, {
      responseType: 'blob'
    });
  }
};

// Coaches API
export const coachesAPI = {
  // Get all coaches
  getAll: (params = {}) => {
    return api.get('/coaches', { params });
  },

  // Get single coach
  getById: (id) => {
    return api.get(`/coaches/${id}`);
  },

  // Create coach profile
  create: (coachData) => {
    return api.post('/coaches', coachData);
  },

  // Update coach profile
  update: (id, coachData) => {
    return api.put(`/coaches/${id}`, coachData);
  },

  // Delete/deactivate coach
  delete: (id) => {
    return api.delete(`/coaches/${id}`);
  },

  // Toggle coach status
  toggleStatus: (id, statusData) => {
    return api.put(`/coaches/${id}/status`, statusData);
  },

  // Update coach availability
  updateAvailability: (id, availabilityData) => {
    return api.put(`/coaches/${id}/availability`, availabilityData);
  },

  // Get coaches by specialization
  getBySpecialization: (specialization, params = {}) => {
    return api.get(`/coaches/specialization/${specialization}`, { params });
  },

  // Assign program to coach
  assignProgram: (id, programData) => {
    return api.put(`/coaches/${id}/assign-program`, programData);
  },

  // Remove program from coach
  removeProgram: (id, programData) => {
    return api.put(`/coaches/${id}/remove-program`, programData);
  },

  // Get coach statistics
  getStats: () => {
    return api.get('/coaches/stats/overview');
  }
};

// Export default api instance for custom requests
export default api;
