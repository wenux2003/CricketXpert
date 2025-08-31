import { loadStripe } from '@stripe/stripe-js';

// For demo purposes, we'll create a mock Stripe object
// In production, replace with your actual Stripe publishable key
const createMockStripe = () => {
  return Promise.resolve({
    createPaymentMethod: () => Promise.resolve({
      paymentMethod: {
        id: 'pm_demo_' + Date.now(),
        card: { brand: 'visa', last4: '4242' }
      }
    }),
    elements: () => ({
      getElement: () => ({
        // Mock card element
      })
    })
  });
};

// Use mock Stripe for demo
const stripePromise = createMockStripe();

export default stripePromise;


