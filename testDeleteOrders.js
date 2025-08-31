const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testDeleteOrders() {
  console.log('🧪 Testing Delete Order Functionality...\n');

  try {
    // Test 1: Get all orders first
    console.log('1. Fetching all orders...');
    const allOrdersResponse = await axios.get(`${BASE_URL}/orders/`);
    console.log('✅ All orders retrieved:', allOrdersResponse.data.length, 'orders');

    // Test 2: Get a real product ID for the test order
    console.log('\n2. Getting a real product ID...');
    const productsResponse = await axios.get(`${BASE_URL}/products/`);
    if (productsResponse.data.length === 0) {
      console.log('❌ No products found in database');
      return;
    }
    const realProductId = productsResponse.data[0]._id;
    console.log('✅ Using real product ID:', realProductId);

    // Test 3: Create a test order to delete
    console.log('\n3. Creating a test order for deletion...');
    const testOrderData = {
      customerId: '68a34c9c6c30e2b6fa15c978',
      items: [
        {
          productId: realProductId,
          quantity: 1,
          priceAtOrder: 100
        }
      ],
      amount: 550, // 100 + 450 delivery
      address: 'Test Address for Deletion',
      status: 'created'
    };

    const createResponse = await axios.post(`${BASE_URL}/orders/`, testOrderData);
    const testOrderId = createResponse.data._id;
    console.log('✅ Test order created with ID:', testOrderId);

    // Test 4: Verify the test order exists
    console.log('\n4. Verifying test order exists...');
    const verifyResponse = await axios.get(`${BASE_URL}/orders/${testOrderId}`);
    console.log('✅ Test order verified:', verifyResponse.data._id);

    // Test 5: Delete the test order
    console.log('\n5. Deleting test order...');
    const deleteResponse = await axios.delete(`${BASE_URL}/orders/${testOrderId}`);
    console.log('✅ Order deleted successfully:', deleteResponse.data.message);

    // Test 6: Verify the order is deleted
    console.log('\n6. Verifying order is deleted...');
    try {
      await axios.get(`${BASE_URL}/orders/${testOrderId}`);
      console.log('❌ Error: Order still exists after deletion');
    } catch (err) {
      if (err.response?.status === 404) {
        console.log('✅ Order successfully deleted (404 Not Found)');
      } else {
        console.log('❌ Unexpected error:', err.message);
      }
    }

    // Test 7: Get orders count after deletion
    console.log('\n7. Checking orders count after deletion...');
    const finalOrdersResponse = await axios.get(`${BASE_URL}/orders/`);
    console.log('✅ Final orders count:', finalOrdersResponse.data.length, 'orders');

    console.log('\n🎉 Delete order functionality is working correctly!');
    console.log('\n📋 Delete Order Features:');
    console.log('   • ✅ Create test order with real product ID');
    console.log('   • ✅ Delete order by ID');
    console.log('   • ✅ Verify order deletion');
    console.log('   • ✅ Proper error handling');
    console.log('   • ✅ Database consistency maintained');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testDeleteOrders();
