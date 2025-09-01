import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Coaching Programs API
export const coachingProgramsAPI = {
  // Get all programs with filters
  getPrograms: (params = {}) => API.get('/coaching-programs', { params }),
  
  // Get program by ID
  getProgramById: (id) => API.get(`/coaching-programs/${id}`),
  
  // Get program enrollments
  getProgramEnrollments: (id, params = {}) => API.get(`/coaching-programs/${id}/enrollments`, { params }),
  
  // Get program statistics
  getProgramStats: (id) => API.get(`/coaching-programs/${id}/stats`),
};

// Enrollments API
export const enrollmentsAPI = {
  // Create new enrollment
  createEnrollment: (data) => API.post('/enrollments', data),
  
  // Confirm payment
  confirmPayment: (data) => API.post('/enrollments/confirm-payment', data),
  
  // Get user enrollments
  getUserEnrollments: (userId, params = {}) => API.get(`/enrollments/user/${userId}`, { params }),
  
  // Get enrollment by ID
  getEnrollmentById: (id) => API.get(`/enrollments/${id}`),
  
  // Cancel enrollment
  cancelEnrollment: (id, data) => API.put(`/enrollments/${id}/cancel`, data),
  
  // Generate certificate
  generateCertificate: (id) => API.post(`/enrollments/${id}/certificate`),
};

// Payments API
export const paymentsAPI = {
  // Create payment
  createPayment: (data) => API.post('/payments', data),
  
  // Get payment by ID
  getPaymentById: (id) => API.get(`/payments/${id}`),
  
  // Get user payments
  getUserPayments: (userId, params = {}) => API.get(`/payments/user/${userId}`, { params }),
  
  // Generate receipt
  generateReceipt: (id) => API.get(`/payments/${id}/receipt`),
};

// Users API
export const usersAPI = {
  // Get user by ID
  getUserById: (id) => API.get(`/users/${id}`),
  
  // Update user
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  
  // Create user (registration)
  createUser: (data) => API.post('/users', data),
};

// Sessions API
export const sessionsAPI = {
  // Get sessions
  getSessions: (params = {}) => API.get('/sessions', { params }),
  
  // Get session by ID
  getSessionById: (id) => API.get(`/sessions/${id}`),
  
  // Book session
  bookSession: (sessionId, data) => API.post(`/sessions/${sessionId}/book`, data),
  
  // Cancel booking
  cancelBooking: (sessionId, data) => API.post(`/sessions/${sessionId}/cancel-booking`, data),
  
  // Get available slots
  getAvailableSlots: (params) => API.get('/sessions/available-slots', { params }),
  
  // Get calendar data
  getCalendarData: (params = {}) => API.get('/sessions/calendar', { params }),
};

// Coaches API
export const coachesAPI = {
  // Get all coaches
  getCoaches: (params = {}) => API.get('/coaches', { params }),
  
  // Get coach by ID
  getCoachById: (id) => API.get(`/coaches/${id}`),
  
  // Get coach programs
  getCoachPrograms: (id, params = {}) => API.get(`/coaches/${id}/programs`, { params }),
};

// Dashboard API
export const dashboardAPI = {
  // Get user dashboard
  getUserDashboard: (userId) => API.get(`/dashboard/user/${userId}`),
  
  // Get coach dashboard
  getCoachDashboard: (coachId) => API.get(`/dashboard/coach/${coachId}`),
  
  // Get admin dashboard
  getAdminDashboard: () => API.get('/dashboard/admin'),
};

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getUserNotifications: (userId, params = {}) => API.get(`/notifications/user/${userId}`, { params }),
  
  // Mark as read
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  
  // Mark all as read
  markAllAsRead: (userId) => API.put(`/notifications/user/${userId}/mark-all-read`),
  
  // Get unread count
  getUnreadCount: (userId) => API.get(`/notifications/user/${userId}/unread-count`),
};

// Certificates API
export const certificatesAPI = {
  // Get user certificates
  getUserCertificates: (userId, params = {}) => API.get(`/certificates/user/${userId}`, { params }),
  
  // Get certificate by ID
  getCertificateById: (id) => API.get(`/certificates/${id}`),
  
  // Download certificate
  downloadCertificate: (id) => API.get(`/certificates/${id}/download`, { responseType: 'blob' }),
  
  // Verify certificate
  verifyCertificate: (number) => API.get(`/certificates/verify/${number}`),
};

export default API;














