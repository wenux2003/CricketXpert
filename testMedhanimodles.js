const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import models
const Coach = require('./models/Coach');
const CoachingProgram = require('./models/CoachingProgram');
const Enrollment = require('./models/Enrollment');
const Booking = require('./models/Booking'); // ✅ Added

async function testModels() {
  await connectDB();

  try {
    const coach = await Coach.create({
      CoachId: new mongoose.Types.ObjectId(),
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

    const program = await CoachingProgram.create({
      title: "Advanced Batting Techniques",
      description: "Improve batting with advanced drills and techniques.",
      fee: 150,
      duration: 4,
      coachId: coach.CoachId, // ✅ Fixed field
      certificateTemplate: "/certificates/batting_template.pdf",
      materials: [
        { name: 'Batting Guide PDF', type: 'document', url: '/materials/batting_guide.pdf' },
        { name: 'Batting Video', type: 'video', url: '/materials/batting_video.mp4' }
      ]
    });

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

    const coachingBooking = await Booking.create({
      customerId: new mongoose.Types.ObjectId(),
      type: "coaching",
      enrollmentId: enrollment._id, // ✅ Linked to real enrollment
      sessionTime: new Date("2025-08-20T14:00:00Z"),
      paymentId: new mongoose.Types.ObjectId()
    });

    const groundBooking = await Booking.create({
      customerId: new mongoose.Types.ObjectId(),
      type: "ground",
      groundId: new mongoose.Types.ObjectId(),
      sessionTime: new Date("2025-08-22T09:00:00Z"),
      startTime: "09:00 AM",
      endTime: "11:00 AM",
      paymentId: new mongoose.Types.ObjectId()
    });

    console.log("✅ Sample data inserted successfully:", { coach, program, enrollment, coachingBooking, groundBooking });

  } catch (error) {
    console.error("❌ Error inserting sample data:", error);
  } finally {
    mongoose.connection.close();
  }
}

testModels();
