import { testAPI } from '../services/api';

export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const response = await testAPI();
    console.log('Backend connection successful:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Backend connection failed:', error);
    return { success: false, error: error.message };
  }
};

export const testCoachAPI = async () => {
  try {
    console.log('Testing coach API...');
    const response = await fetch('http://localhost:5000/api/coaches');
    const data = await response.json();
    console.log('Coach API response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Coach API test failed:', error);
    return { success: false, error: error.message };
  }
};

export const testUserAPI = async () => {
  try {
    console.log('Testing user API...');
    const response = await fetch('http://localhost:5000/api/users');
    const data = await response.json();
    console.log('User API response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('User API test failed:', error);
    return { success: false, error: error.message };
  }
};
