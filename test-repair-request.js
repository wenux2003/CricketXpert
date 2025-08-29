const axios = require('axios');
require('dotenv').config();

async function testRepairRequestWithEmail() {
  console.log('🧪 Testing Repair Request Creation with Email Notification...\n');
  
  try {
    // First, let's create a test user
    console.log('👤 Creating test user...');
    const userData = {
      username: 'testuser123',
      email: 'testuser@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    };

    let userId;
    try {
      const userResponse = await axios.post('http://localhost:5000/api/users/register', userData);
      userId = userResponse.data.user._id;
      console.log('✅ Test user created with ID:', userId);
    } catch (userError) {
      console.log('⚠️ User creation failed, trying to use existing user...');
      // Try to get an existing user
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        if (usersResponse.data && usersResponse.data.length > 0) {
          userId = usersResponse.data[0]._id;
          console.log('✅ Using existing user with ID:', userId);
        } else {
          throw new Error('No users found');
        }
      } catch (getUserError) {
        console.log('❌ Could not get user ID, using a dummy ID for testing...');
        userId = '507f1f77bcf86cd799439011'; // Dummy MongoDB ObjectId
      }
    }

    // Test data for repair request with valid enum values
    const repairRequestData = {
      customerId: userId,
      equipmentType: 'cricket_bat',
      damageType: 'Bat Handle Damage',
      description: 'This is a test repair request to verify email functionality works properly'
    };

    console.log('\n📤 Sending repair request to server...');
    console.log('📧 This should trigger an email to the service manager...\n');

    const response = await axios.post('http://localhost:5000/api/repairs', repairRequestData);
    
    console.log('✅ Repair request created successfully!');
    console.log('📋 Response:', response.data);
    console.log('\n📧 Check the service manager email for notification!');
    console.log('📧 Service Manager Email:', process.env.SERVICE_MANAGER_EMAIL);
    
  } catch (error) {
    console.error('❌ Error creating repair request:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      console.log('\n💡 This might be due to database issues, but email functionality should still work');
    }
    
    // Even if the request fails, let's test the email functionality directly
    console.log('\n🧪 Testing email functionality directly...');
    try {
      const { sendEmail } = require('./utils/notification');
      const emailResult = await sendEmail(
        process.env.SERVICE_MANAGER_EMAIL,
        'Test Email from Repair Request System',
        'This is a test email to verify that the email system is working correctly in the application context.'
      );
      console.log(emailResult ? '✅ Direct email test successful!' : '❌ Direct email test failed!');
    } catch (emailError) {
      console.error('❌ Direct email test error:', emailError.message);
    }
  }
}

testRepairRequestWithEmail();
