// Application constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000, // 10 seconds
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  COACH: 'coach',
  COACHING_MANAGER: 'coaching_manager',
  ADMIN: 'admin',
  GROUND_MANAGER: 'ground_manager',
  ORDER_MANAGER: 'order_manager',
  SERVICE_MANAGER: 'service_manager',
  TECHNICIAN: 'technician',
  DELIVERY_STAFF: 'delivery_staff'
};

// Program Categories
export const PROGRAM_CATEGORIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' }
];

// Specializations
export const SPECIALIZATIONS = [
  { value: 'batting', label: 'Batting' },
  { value: 'bowling', label: 'Bowling' },
  { value: 'fielding', label: 'Fielding' },
  { value: 'wicket-keeping', label: 'Wicket Keeping' },
  { value: 'all-rounder', label: 'All Rounder' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'mental-coaching', label: 'Mental Coaching' }
];

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

// Enrollment Status
export const ENROLLMENT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
};

// Session Status
export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ENROLLMENT_CONFIRMATION: 'enrollment_confirmation',
  ENROLLMENT_PENDING: 'enrollment_pending',
  ENROLLMENT_REJECTED: 'enrollment_rejected',
  SESSION_SCHEDULED: 'session_scheduled',
  SESSION_REMINDER: 'session_reminder',
  SESSION_CANCELLED: 'session_cancelled',
  SESSION_RESCHEDULED: 'session_rescheduled',
  SESSION_COMPLETED: 'session_completed',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REMINDER: 'payment_reminder',
  PROGRAM_STARTING: 'program_starting',
  PROGRAM_COMPLETED: 'program_completed',
  CERTIFICATE_READY: 'certificate_ready',
  COACH_FEEDBACK: 'coach_feedback',
  GENERAL: 'general',
  SYSTEM: 'system'
};

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit/Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'mobile_payment', label: 'Mobile Payment' },
  { value: 'cash', label: 'Cash' }
];

// Days of Week
export const DAYS_OF_WEEK = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' }
];

// Fitness Levels
export const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

// File Types for Materials
export const MATERIAL_TYPES = [
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Document' },
  { value: 'image', label: 'Image' },
  { value: 'link', label: 'External Link' }
];

// Certificate Status
export const CERTIFICATE_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  EXPIRED: 'expired'
};

// Default Pagination
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'YYYY-MM-DD HH:mm:ss'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+94|0)?7[0-9]{8}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 2000,
  BIO_MAX_LENGTH: 1000
};

// Ground Configuration
export const GROUND_CONFIG = {
  MAX_SLOTS: 12,
  MIN_SLOTS: 1,
  OPERATING_HOURS: {
    START: 6, // 6 AM
    END: 22   // 10 PM
  },
  BOOKING_DEADLINE_HOURS: 2 // 2 hours before session
};

// Session Configuration
export const SESSION_CONFIG = {
  MAX_PARTICIPANTS: 20,
  MIN_PARTICIPANTS: 1,
  DEFAULT_DURATION: 90, // minutes
  REMINDER_TIMES: [
    { value: 600, label: '10 minutes before' },
    { value: 3600, label: '1 hour before' },
    { value: 86400, label: '1 day before' }
  ]
};

// Progress Thresholds
export const PROGRESS_THRESHOLDS = {
  CERTIFICATE_ELIGIBILITY: 80, // 80% completion required
  EXCELLENT: 90,
  GOOD: 70,
  SATISFACTORY: 50
};

// Rating Scale
export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0
};

// Currency
export const CURRENCY = {
  CODE: 'LKR',
  SYMBOL: 'Rs.',
  LOCALE: 'en-LK'
};

// Application Settings
export const APP_SETTINGS = {
  NAME: 'CricketXpert',
  DESCRIPTION: 'Professional Cricket Coaching Platform',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@cricketxpert.com',
  CONTACT_PHONE: '+94-11-1234567'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  GENERIC: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ENROLLMENT_SUCCESS: 'Enrollment completed successfully!',
  PAYMENT_SUCCESS: 'Payment processed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SESSION_BOOKED: 'Session booked successfully!',
  FEEDBACK_SUBMITTED: 'Feedback submitted successfully!'
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export default {
  API_CONFIG,
  USER_ROLES,
  PROGRAM_CATEGORIES,
  SPECIALIZATIONS,
  DIFFICULTY_LEVELS,
  ENROLLMENT_STATUS,
  PAYMENT_STATUS,
  SESSION_STATUS,
  NOTIFICATION_TYPES,
  PAYMENT_METHODS,
  DAYS_OF_WEEK,
  FITNESS_LEVELS,
  MATERIAL_TYPES,
  CERTIFICATE_STATUS,
  DEFAULT_PAGINATION,
  DATE_FORMATS,
  VALIDATION_RULES,
  GROUND_CONFIG,
  SESSION_CONFIG,
  PROGRESS_THRESHOLDS,
  RATING_SCALE,
  CURRENCY,
  APP_SETTINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_STATES
};














