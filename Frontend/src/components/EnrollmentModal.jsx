import React, { useState } from 'react';
import { X, CreditCard, Lock, User, Mail, Phone, Loader2, CheckCircle } from 'lucide-react';
import { enrollmentsAPI, paymentsAPI } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};

const PaymentForm = ({ program, onSuccess, onCancel, customerInfo, setCustomerInfo }) => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [step, setStep] = useState(1); // 1: Customer Info, 2: Payment

  const handleCustomerInfoSubmit = (e) => {
    e.preventDefault();
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    setProcessing(true);
    setPaymentError(null);

    try {
      // Demo payment processing - simulate payment validation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create mock payment method for demo
      const mockPaymentMethod = {
        id: 'pm_demo_' + Date.now(),
        card: { brand: 'visa', last4: '4242' }
      };

      // Create mock enrollment for demo mode
      const mockEnrollment = {
        _id: 'enrollment_' + Date.now(),
        program: program,
        user: user,
        status: 'active',
        enrollmentDate: new Date().toISOString(),
        paymentDetails: {
          paymentMethodId: mockPaymentMethod.id,
          amount: program.price,
          currency: 'lkr',
          status: 'completed'
        },
        progress: {
          progressPercentage: 0,
          completedSessions: 0,
          totalSessions: program.totalSessions || 12
        }
      };

      // Store enrollment in localStorage for demo
      const existingEnrollments = JSON.parse(localStorage.getItem(`enrollments_${user.id}`)) || [];
      existingEnrollments.push(mockEnrollment);
      localStorage.setItem(`enrollments_${user.id}`, JSON.stringify(existingEnrollments));

      toast.success('Payment successful! You are now enrolled in the program.');
      onSuccess(mockEnrollment);

    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err.message);
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center space-x-4 mb-6">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            {step > 1 ? <CheckCircle size={16} /> : '1'}
          </div>
          <span className="text-sm font-medium">Customer Info</span>
        </div>
        <div className="flex-1 h-px bg-gray-200"></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            <CreditCard size={16} />
          </div>
          <span className="text-sm font-medium">Payment</span>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleCustomerInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={customerInfo.fullName}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Program:</span>
                <span className="font-medium">{program.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{program.duration?.weeks} weeks</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-medium">
                <span>Total:</span>
                <span className="text-lg">{formatPrice(program.price)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Customer Information</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>{customerInfo.fullName}</div>
                  <div>{customerInfo.email}</div>
                  <div>{customerInfo.phone}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details (Demo Mode)
            </label>
            <div className="border border-gray-300 rounded-md p-3 bg-white">
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Card Number (e.g., 4242 4242 4242 4242)"
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="12/25"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="123"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Demo mode: Any values will work for testing
            </p>
          </div>

          {paymentError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{paymentError}</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Lock size={16} />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={processing}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay ${formatPrice(program.price)}`
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const EnrollmentModal = ({ isOpen, onClose, program, onSuccess }) => {
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleSuccess = (enrollment) => {
    onSuccess(enrollment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Enroll in Program
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Program Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">{program.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{program.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Duration: {program.duration?.weeks} weeks</span>
              <span className="font-medium text-lg">
                {new Intl.NumberFormat('en-LK', {
                  style: 'currency',
                  currency: 'LKR',
                  minimumFractionDigits: 0
                }).format(program.price)}
              </span>
            </div>
          </div>

          {/* Payment Form */}
          <PaymentForm
            program={program}
            onSuccess={handleSuccess}
            onCancel={onClose}
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
          />
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
