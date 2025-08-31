const { sendEmail } = require('./utils/notification');
require('dotenv').config();

async function testAllEmailScenarios() {
  console.log('🧪 Testing All Email Scenarios...\n');
  
  // Test 1: Service Manager Notification
  console.log('📧 Test 1: Service Manager Notification');
  try {
    const result1 = await sendEmail(
      process.env.SERVICE_MANAGER_EMAIL,
      'New Repair Request Submitted',
      `A new repair request has been submitted.\n\nCustomer ID: test123\nEquipment: Cricket Bat\nDamage Type: Broken Handle`
    );
    console.log(result1 ? '✅ Passed' : '❌ Failed');
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  // Test 2: Customer Status Update
  console.log('\n📧 Test 2: Customer Status Update');
  try {
    const result2 = await sendEmail(
      'test@example.com',
      'Repair Request Status Updated',
      `Hello TestUser,\n\nYour repair request status is: Approved\nCost Estimate: $50\nTime Estimate: 2 days\n\nThank you,\nService Team`
    );
    console.log(result2 ? '✅ Passed' : '❌ Failed');
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  // Test 3: Technician Assignment
  console.log('\n📧 Test 3: Technician Assignment');
  try {
    const result3 = await sendEmail(
      'technician@example.com',
      'New Repair Assignment',
      `You have been assigned a new repair request:\n\nRequest ID: 12345\nEquipment: Cricket Bat\nDamage Type: Broken Handle\nCustomer: TestUser\n\nPlease begin work on this repair.`
    );
    console.log(result3 ? '✅ Passed' : '❌ Failed');
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  // Test 4: Customer Progress Update
  console.log('\n📧 Test 4: Customer Progress Update');
  try {
    const result4 = await sendEmail(
      'customer@example.com',
      '🎯 Halfway Completed',
      `Hello TestUser,\n\n🎉 🎯 Halfway Completed!\n\nYour repair request has been updated:\n\n📊 Progress: 50%\n📋 Status: In Repair\n📍 Current Stage: Halfway Completed\n👨‍🔧 Technician: John Doe (@johndoe)\n\n📝 Technician Notes:\nRepair is progressing well. Handle has been replaced.\n\n🎯 This is a key milestone in your repair process!\n\nThank you for choosing our service!\n\nBest regards,\nCricketXpert Repair Team`
    );
    console.log(result4 ? '✅ Passed' : '❌ Failed');
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  // Test 5: Service Manager Milestone Notification
  console.log('\n📧 Test 5: Service Manager Milestone Notification');
  try {
    const result5 = await sendEmail(
      process.env.SERVICE_MANAGER_EMAIL,
      'Milestone Update: 🎯 Halfway Completed',
      `A repair request has reached a milestone:\n\nCustomer: TestUser\nEquipment: Cricket Bat\nDamage: Broken Handle\nProgress: 50%\nStatus: In Repair\nStage: Halfway Completed\nTechnician: John Doe`
    );
    console.log(result5 ? '✅ Passed' : '❌ Failed');
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  // Test 6: Feedback Notification
  console.log('\n📧 Test 6: Feedback Notification');
  try {
    const result6 = await sendEmail(
      process.env.SERVICE_MANAGER_EMAIL,
      'New Feedback on Repair Request',
      `Feedback from TestUser\n\n regarding Repair Request ID: 12345.\n\nFeedback: Great service! The repair was completed quickly and professionally.`
    );
    console.log(result6 ? '✅ Passed' : '❌ Failed');
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  // Test 7: Feedback Response
  console.log('\n📧 Test 7: Feedback Response');
  try {
    const result7 = await sendEmail(
      'customer@example.com',
      'Feedback Update',
      `Hello TestUser,\n\nYour feedback has been updated.\nStatus: Resolved\nResponse: Thank you for your positive feedback! We're glad we could help.\n\nThank you,\nService Team`
    );
    console.log(result7 ? '✅ Passed' : '❌ Failed');
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  console.log('\n🎉 All email tests completed!');
  console.log('\n📋 Summary:');
  console.log('- If all tests passed (✅), email functionality is working correctly');
  console.log('- If any tests failed (❌), check the error messages above');
  console.log('- Make sure your Gmail app password is correct in the .env file');
}

testAllEmailScenarios();
