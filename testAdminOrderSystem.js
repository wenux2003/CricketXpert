const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAdminOrderSystem() {
  console.log('🧪 Testing Admin Order Management System...\n');

  try {
    // Test 1: Get all orders
    console.log('1. Fetching all orders...');
    const allOrdersResponse = await axios.get(`${BASE_URL}/orders/`);
    console.log('✅ All orders retrieved:', allOrdersResponse.data.length, 'orders');

    // Test 2: Get orders by status
    console.log('\n2. Fetching orders by status...');
    const createdOrdersResponse = await axios.get(`${BASE_URL}/orders/status/created`);
    console.log('✅ Created orders:', createdOrdersResponse.data.length);

    const processingOrdersResponse = await axios.get(`${BASE_URL}/orders/status/processing`);
    console.log('✅ Processing orders:', processingOrdersResponse.data.length);

    const completedOrdersResponse = await axios.get(`${BASE_URL}/orders/status/completed`);
    console.log('✅ Completed orders:', completedOrdersResponse.data.length);

    // Test 3: Update order status (if orders exist)
    if (allOrdersResponse.data.length > 0) {
      const firstOrder = allOrdersResponse.data[0];
      console.log('\n3. Updating order status...');
      console.log('   Order ID:', firstOrder._id);
      console.log('   Current status:', firstOrder.status);

      // Update to processing
      const updateResponse = await axios.put(`${BASE_URL}/orders/${firstOrder._id}`, {
        status: 'processing'
      });
      console.log('✅ Order status updated to:', updateResponse.data.status);

      // Update back to created
      const revertResponse = await axios.put(`${BASE_URL}/orders/${firstOrder._id}`, {
        status: 'created'
      });
      console.log('✅ Order status reverted to:', revertResponse.data.status);
    } else {
      console.log('\n3. No orders found to test status update');
    }

    // Test 4: Get specific order details
    if (allOrdersResponse.data.length > 0) {
      const firstOrder = allOrdersResponse.data[0];
      console.log('\n4. Getting specific order details...');
      const orderDetailsResponse = await axios.get(`${BASE_URL}/orders/${firstOrder._id}`);
      console.log('✅ Order details retrieved:');
      console.log('   Order ID:', orderDetailsResponse.data._id);
      console.log('   Status:', orderDetailsResponse.data.status);
      console.log('   Amount:', orderDetailsResponse.data.amount);
      console.log('   Items:', orderDetailsResponse.data.items?.length || 0);
      console.log('   Address:', orderDetailsResponse.data.address);
    }

    console.log('\n🎉 Admin order management system is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAdminOrderSystem();
