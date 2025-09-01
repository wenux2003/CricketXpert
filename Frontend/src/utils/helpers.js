// Utility functions for the coaching system

/**
 * Format price in Sri Lankan Rupees
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR'
  }).format(price);
};

/**
 * Format date in a readable format
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format time in a readable format
 * @param {string} time - Time in HH:MM format
 * @returns {string} Formatted time string
 */
export const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Calculate age from date of birth
 * @param {string|Date} dateOfBirth - Date of birth
 * @returns {number} Age in years
 */
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Get status color classes for badges
 * @param {string} status - The status to get colors for
 * @returns {string} Tailwind CSS classes
 */
export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get difficulty level color classes
 * @param {string} difficulty - The difficulty level
 * @returns {string} Tailwind CSS classes
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800';
};

/**
 * Get category color classes
 * @param {string} category - The category
 * @returns {string} Tailwind CSS classes
 */
export const getCategoryColor = (category) => {
  const colors = {
    beginner: 'bg-blue-100 text-blue-800',
    intermediate: 'bg-purple-100 text-purple-800',
    advanced: 'bg-orange-100 text-orange-800',
    professional: 'bg-red-100 text-red-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Replace hyphens with spaces and capitalize
 * @param {string} str - String to format
 * @returns {string} Formatted string
 */
export const formatSpecialization = (str) => {
  return capitalizeWords(str.replace(/-/g, ' '));
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate initials from name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Initials
 */
export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if a date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

/**
 * Get days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days
 */
export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (Sri Lankan)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+94|0)?7[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Local storage helpers
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};














