// testContact.js
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // make sure it connects to your MongoDB
const Contact = require('./models/Contact'); // adjust path if needed

console.log("🔍 Contact schema definition:");
console.log(JSON.stringify(Contact.schema.obj, null, 2)); // Shows what Node is actually using

async function testContactModel() {
  await connectDB();

  try {
    // 1️⃣ Create a single contact entry
    const contact = await Contact.create({
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Service Inquiry",
      message: "Could you please provide details about your batting coaching?",
      // status is optional because it defaults to 'pending'
    });

    console.log("✅ Sample Contact inserted successfully:");
    console.log(contact);

  } catch (error) {
    console.error("❌ Error inserting contact:", error);
  } finally {
    mongoose.connection.close();
  }
}

testContactModel();
