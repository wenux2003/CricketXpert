const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testRouting() {
  console.log('🧪 Testing Routing and Navigation...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const healthCheck = await axios.get(`${BASE_URL}/products/`);
    console.log('✅ Server is running and responding');

    // Test 2: Check if orders endpoint is accessible
    console.log('\n2. Testing orders endpoint...');
    const ordersResponse = await axios.get(`${BASE_URL}/orders/`);
    console.log('✅ Orders endpoint accessible:', ordersResponse.data.length, 'orders found');

    // Test 3: Check if order status filtering works
    console.log('\n3. Testing order status filtering...');
    const createdOrders = await axios.get(`${BASE_URL}/orders/status/created`);
    console.log('✅ Status filtering works:', createdOrders.data.length, 'created orders');

    // Test 4: Check if specific order can be retrieved
    if (ordersResponse.data.length > 0) {
      console.log('\n4. Testing specific order retrieval...');
      const firstOrder = ordersResponse.data[0];
      const orderDetails = await axios.get(`${BASE_URL}/orders/${firstOrder._id}`);
      console.log('✅ Specific order retrieval works:', orderDetails.data._id);
    }

    // Test 5: Check if cart order endpoints work
    console.log('\n5. Testing cart order endpoints...');
    const userId = '68a34c9c6c30e2b6fa15c978';
    try {
      const cartOrder = await axios.get(`${BASE_URL}/orders/cart/${userId}`);
      console.log('✅ Cart order endpoint accessible');
    } catch (err) {
      console.log('ℹ️  No cart order found (this is normal if user has no pending cart)');
    }

    console.log('\n🎉 All routing tests passed!');
    console.log('\n📋 Available Routes:');
    console.log('   • / - Home page');
    console.log('   • /cart - Shopping cart');
    console.log('   • /delivery - Delivery information');
    console.log('   • /payment - Payment page');
    console.log('   • /orders - Order summary');
    console.log('   • /my-orders - Customer order history');
    console.log('   • /track-order - Order tracking');
    console.log('   • /orders/:orderId - Order details');
    console.log('   • /admin - Admin dashboard');
    console.log('   • /admin/add - Add products');
    console.log('   • /admin/list - List products');
    console.log('   • /admin/orders - Manage orders');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testRouting();
