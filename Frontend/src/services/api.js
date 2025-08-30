// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Coaching Programs API
  async getCoachingPrograms(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/coaching-programs${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getCoachingProgramById(id) {
    return this.makeRequest(`/coaching-programs/${id}`);
  }

  async getProgramEnrollments(programId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/coaching-programs/${programId}/enrollments${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  // Enrollments API
  async createEnrollment(enrollmentData) {
    return this.makeRequest('/enrollments', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
  }

  async getUserEnrollments(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/enrollments/user/${userId}${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getEnrollmentById(id) {
    return this.makeRequest(`/enrollments/${id}`);
  }

  async cancelEnrollment(enrollmentId, reason) {
    return this.makeRequest(`/enrollments/${enrollmentId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  // Sessions API
  async getSessions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/sessions${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async bookSession(sessionId, userId) {
    return this.makeRequest(`/sessions/${sessionId}/book`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async cancelSessionBooking(sessionId, userId) {
    return this.makeRequest(`/sessions/${sessionId}/cancel-booking`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getAvailableSlots(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/sessions/available-slots${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  // Payments API
  async createPayment(paymentData) {
    return this.makeRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getUserPayments(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/payments/user/${userId}${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getPaymentReceipt(paymentId) {
    return this.makeRequest(`/payments/${paymentId}/receipt`);
  }

  // Coaches API
  async getCoaches(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/coaches${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async getCoachById(id) {
    return this.makeRequest(`/coaches/${id}`);
  }

  // Notifications API
  async getUserNotifications(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/notifications/user/${userId}${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async markNotificationAsRead(notificationId) {
    return this.makeRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async getUnreadCount(userId) {
    return this.makeRequest(`/notifications/user/${userId}/unread-count`);
  }

  // Certificates API
  async getUserCertificates(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/certificates/user/${userId}${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest(endpoint);
  }

  async downloadCertificate(certificateId) {
    const url = `${this.baseURL}/certificates/${certificateId}/download`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${certificateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Dashboard API
  async getUserDashboard(userId) {
    return this.makeRequest(`/dashboard/user/${userId}`);
  }

  // Ground API
  async getGrounds() {
    return this.makeRequest('/grounds');
  }

  async getGroundAvailability(groundId, date) {
    return this.makeRequest(`/grounds/${groundId}/availability?date=${date}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
