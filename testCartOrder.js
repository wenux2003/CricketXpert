const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const USER_ID = '68a34c9c6c30e2b6fa15c978';

async function testCartOrderSystem() {
  console.log('🧪 Testing Cart Order System...\n');

  try {
    // Test 1: Create a cart order
    console.log('1. Creating cart order...');
    const cartOrderData = {
      customerId: USER_ID,
      items: [
        {
          productId: '507f1f77bcf86cd799439011', // Sample product ID
          quantity: 2,
          priceAtOrder: 1500
        },
        {
          productId: '507f1f77bcf86cd799439012', // Sample product ID
          quantity: 1,
          priceAtOrder: 800
        }
      ],
      amount: 4250, // 1500*2 + 800 + 450 delivery
      address: 'Mumbai, Maharashtra, India'
    };

    const createResponse = await axios.post(`${BASE_URL}/orders/cart`, cartOrderData);
    console.log('✅ Cart order created:', createResponse.data._id);
    const orderId = createResponse.data._id;

    // Test 2: Get cart order
    console.log('\n2. Getting cart order...');
    const getResponse = await axios.get(`${BASE_URL}/orders/cart/${USER_ID}`);
    console.log('✅ Cart order retrieved:', getResponse.data._id);
    console.log('   Status:', getResponse.data.status);
    console.log('   Items count:', getResponse.data.items.length);
    console.log('   Address:', getResponse.data.address);

    // Test 3: Update cart order
    console.log('\n3. Updating cart order...');
    const updatedCartOrderData = {
      customerId: USER_ID,
      items: [
        {
          productId: '507f1f77bcf86cd799439011',
          quantity: 3, // Increased quantity
          priceAtOrder: 1500
        }
      ],
      amount: 4950, // 1500*3 + 450 delivery
      address: 'Mumbai, Maharashtra, India'
    };

    const updateResponse = await axios.post(`${BASE_URL}/orders/cart`, updatedCartOrderData);
    console.log('✅ Cart order updated:', updateResponse.data._id);
    console.log('   New items count:', updateResponse.data.items.length);

    // Test 4: Complete cart order (simulate payment)
    console.log('\n4. Completing cart order (payment)...');
    
    // First create a payment
    const paymentData = {
      userId: USER_ID,
      orderId: orderId,
      paymentType: 'order_payment',
      amount: 4950,
      status: 'success',
      paymentDate: new Date()
    };

    const paymentResponse = await axios.post(`${BASE_URL}/payments/`, paymentData);
    console.log('✅ Payment created:', paymentResponse.data._id);

    // Then complete the cart order
    const completeResponse = await axios.put(`${BASE_URL}/orders/cart/complete`, {
      orderId: orderId,
      paymentId: paymentResponse.data._id
    });
    console.log('✅ Cart order completed:', completeResponse.data._id);
    console.log('   New status:', completeResponse.data.status);

    // Test 5: Verify order is now in regular orders
    console.log('\n5. Verifying order in regular orders...');
    const regularOrderResponse = await axios.get(`${BASE_URL}/orders/${orderId}`);
    console.log('✅ Order found in regular orders:', regularOrderResponse.data._id);
    console.log('   Final status:', regularOrderResponse.data.status);
    console.log('   Address:', regularOrderResponse.data.address);

    console.log('\n🎉 All tests passed! Cart order system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testCartOrderSystem();
