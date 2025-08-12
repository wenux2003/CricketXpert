const mongoose = require('mongoose');
const connectDB = require('./config/db');

const RepairRequest = require('./models/RepairRequest');
const Technician = require('./models/Technician');
const Feedback = require('./models/Feedback');

async function testModels() {
  await connectDB();

  try {
    // Create Technician sample (use a valid ObjectId for technicianId or create a User first)
    const tech = await Technician.create({
      technicianId: new mongoose.Types.ObjectId(), // Replace with actual User _id if available
      skills: ['Laptop Repair', 'Screen Replacement']
    });

    // Create RepairRequest linked to Technician
    const repair = await RepairRequest.create({
      customerId: new mongoose.Types.ObjectId(),  // Replace with actual User _id if available
      damageType: 'Screen Crack',
      assignedTechnician: tech._id
    });

    // Create Feedback linked to RepairRequest
    const feedback = await Feedback.create({
      requestId: repair._id,
      requestType: 'RepairRequest',
      customerId: new mongoose.Types.ObjectId(),  // Replace with actual User _id if available
      description: 'Good service!',
      category: 'Repair'
    });

    console.log('✅ Sample data inserted successfully:');
    console.log({ tech, repair, feedback });

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  } finally {
    // Close the connection after test completes
    mongoose.connection.close();
  }
}

testModels();

