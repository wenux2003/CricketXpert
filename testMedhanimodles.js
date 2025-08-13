const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Make sure this connects to your MongoDB

// Import your models
const Coach = require('./models/Coach');
const CoachingProgram = require('./models/CoachingProgram');
const Enrollment = require('./models/Enrollment');

console.log("🔍 CoachingProgram schema definition:");
console.log(JSON.stringify(CoachingProgram.schema.obj, null, 2)); // 👈 Shows what Node is actually using

async function testModels() {
  await connectDB();

  try {
    // 1️⃣ Create a Coach
    const coach = await Coach.create({
      userId: new mongoose.Types.ObjectId(),
      specialization: "Batting",
      experienceYears: 8,
      availability: [
        { day: "Monday", startTime: "10:00 AM", endTime: "2:00 PM" },
        { day: "Wednesday", startTime: "3:00 PM", endTime: "6:00 PM" }
      ],
      progress: [
        { partName: "Intro Session", completed: true, completedAt: new Date() }
      ],
      assignedSessions: 5
    });

    // 2️⃣ Create a Coaching Program linked to the coach
    const program = await CoachingProgram.create({
      title: "Advanced Batting Techniques",
      description: "Improve batting with advanced drills and techniques.",
      fee: 150,
      duration: 4, // in weeks
      coachId: coach.userId,
      certificateTemplate: "/certificates/batting_template.pdf",
      materials: [
  {
    name: 'Batting Guide PDF',
    type: 'document',
    url: '/materials/batting_guide.pdf'
  },
  {
    name: 'Batting Video',
    type: 'video',
    url: '/materials/batting_video.mp4'
  }
]

    });

    // 3️⃣ Create an Enrollment linked to the program
    const enrollment = await Enrollment.create({
      customerId: new mongoose.Types.ObjectId(),
      programId: program._id,
      selectedSlot: new Date("2025-08-20T10:00:00Z"),
      status: "confirmed",
      paymentId: new mongoose.Types.ObjectId(),
      progress: [
        { partName: "Module 1 - Basics", completed: true, completedAt: new Date() },
        { partName: "Module 2 - Practice", completed: false }
      ]
    });

    console.log("✅ Sample data inserted successfully:");
    console.log({ coach, program, enrollment });

  } catch (error) {
    console.error("❌ Error inserting sample data:", error);
  } finally {
    mongoose.connection.close();
  }
}

testModels();
