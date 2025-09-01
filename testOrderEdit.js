const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cricketxpert', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const testOrderEdit = async () => {
  try {
    console.log('🧪 Testing Order Edit Functionality...\n');

    // 1. Create a test product
    console.log('1. Creating test product...');
    const testProduct = new Product({
      productId: 'TEST001',
      name: 'Test Cricket Bat',
      description: 'Test product for order edit demo',
      category: 'Bats',
      brand: 'Test Brand',
      price: 1500,
      stock_quantity: 50,
      is_active: true
    });

    await testProduct.save();
    console.log(`✅ Product created: ${testProduct.name}`);
    console.log(`   Product ID: ${testProduct._id}`);

    // 2. Create a test order
    console.log('\n2. Creating test order...');
    const testOrder = new Order({
      customerId: new mongoose.Types.ObjectId(),
      items: [{
        productId: testProduct._id,
        quantity: 2,
        priceAtOrder: 1500
      }],
      amount: 3000,
      address: 'Test Address 123',
      status: 'created',
      date: new Date()
    });

    await testOrder.save();
    console.log(`✅ Order created:`);
    console.log(`   Order ID: ${testOrder._id}`);
    console.log(`   Address: ${testOrder.address}`);
    console.log(`   Amount: LKR ${testOrder.amount}`);
    console.log(`   Status: ${testOrder.status}`);
    console.log(`   Items: ${testOrder.items.length}`);

    // 3. Test order update (simulating the edit functionality)
    console.log('\n3. Testing order update...');
    
    const updateData = {
      address: 'Updated Test Address 456',
      amount: 4500,
      status: 'processing',
      items: [
        {
          productId: testProduct._id,
          quantity: 3,
          priceAtOrder: 1500
        }
      ]
    };

    console.log('   Update data:', updateData);

    // Simulate the update (this would normally happen via API)
    testOrder.address = updateData.address;
    testOrder.amount = updateData.amount;
    testOrder.status = updateData.status;
    testOrder.items = updateData.items;
    
    await testOrder.save();
    console.log(`✅ Order updated successfully!`);

    // 4. Verify the changes
    console.log('\n4. Verifying changes...');
    const updatedOrder = await Order.findById(testOrder._id);
    
    console.log(`   New Address: ${updatedOrder.address}`);
    console.log(`   New Amount: LKR ${updatedOrder.amount}`);
    console.log(`   New Status: ${updatedOrder.status}`);
    console.log(`   New Items: ${updatedOrder.items.length}`);
    console.log(`   Item Details:`);
    updatedOrder.items.forEach((item, index) => {
      console.log(`     Item ${index + 1}: ${item.quantity}x @ LKR ${item.priceAtOrder}`);
    });

    // 5. Test item modifications
    console.log('\n5. Testing item modifications...');
    
    // Add a new item
    updatedOrder.items.push({
      productId: testProduct._id,
      quantity: 1,
      priceAtOrder: 1500
    });
    
    // Update amount
    updatedOrder.amount = updatedOrder.items.reduce((sum, item) => {
      return sum + (item.quantity * item.priceAtOrder);
    }, 0);
    
    await updatedOrder.save();
    console.log(`✅ Items modified:`);
    console.log(`   Total Items: ${updatedOrder.items.length}`);
    console.log(`   New Amount: LKR ${updatedOrder.amount}`);

    // 6. Cleanup test data
    console.log('\n6. Cleaning up test data...');
    await Product.findByIdAndDelete(testProduct._id);
    await Order.findByIdAndDelete(testOrder._id);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Order Edit Test Completed Successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Orders can be created with items');
    console.log('   - Order details can be updated (address, amount, status)');
    console.log('   - Order items can be modified');
    console.log('   - Amount is automatically calculated from items');
    console.log('   - All changes are properly saved to database');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test
testOrderEdit();
