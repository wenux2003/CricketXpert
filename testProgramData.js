const mongoose = require('mongoose');
const CoachingProgram = require('./models/CoachingProgram');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Sample coaching programs data
const samplePrograms = [
  {
    title: "Beginner Cricket Fundamentals",
    description: "Perfect for newcomers to cricket. Learn the basic rules, batting stance, bowling action, and fielding positions. This comprehensive program covers all fundamental aspects of cricket in a supportive, beginner-friendly environment.",
    category: "beginner",
    specialization: "all-rounder",
    duration: {
      weeks: 8,
      sessionsPerWeek: 2
    },
    totalSessions: 16,
    price: 15000,
    maxParticipants: 12,
    currentEnrollments: 8,
    difficulty: "easy",
    startDate: new Date('2025-09-01'),
    endDate: new Date('2025-10-27'),
    isActive: true,
    materials: [
      {
        title: "Cricket Basics Guide",
        type: "document",
        description: "Comprehensive guide covering cricket fundamentals",
        uploadDate: new Date()
      },
      {
        title: "Batting Stance Video Tutorial",
        type: "video",
        description: "Step-by-step video guide for proper batting stance",
        uploadDate: new Date()
      }
    ],
    curriculum: [
      {
        week: 1,
        session: 1,
        title: "Introduction to Cricket",
        objectives: ["Understand cricket rules", "Learn basic equipment", "Safety guidelines"],
        duration: 90
      },
      {
        week: 1,
        session: 2,
        title: "Basic Batting Techniques",
        objectives: ["Proper grip", "Batting stance", "Basic shots"],
        duration: 90
      },
      {
        week: 2,
        session: 1,
        title: "Bowling Fundamentals",
        objectives: ["Bowling action", "Line and length", "Basic deliveries"],
        duration: 90
      }
    ],
    requirements: [
      "No prior cricket experience required",
      "Basic fitness level",
      "Cricket kit (can be provided)"
    ],
    benefits: [
      "Learn cricket from scratch",
      "Build fitness and coordination", 
      "Make new friends",
      "Foundation for advanced training"
    ],
    tags: ["beginner", "fundamentals", "all-skills"]
  },
  {
    title: "Advanced Batting Masterclass",
    description: "Take your batting to the next level with advanced techniques, shot selection, and mental preparation. Designed for players with solid fundamentals who want to excel in competitive cricket.",
    category: "advanced",
    specialization: "batting",
    duration: {
      weeks: 12,
      sessionsPerWeek: 3
    },
    totalSessions: 36,
    price: 35000,
    maxParticipants: 8,
    currentEnrollments: 6,
    difficulty: "hard",
    startDate: new Date('2025-09-15'),
    endDate: new Date('2025-12-07'),
    isActive: true,
    materials: [
      {
        title: "Advanced Batting Techniques",
        type: "video",
        description: "Professional batting techniques and strategies",
        uploadDate: new Date()
      },
      {
        title: "Mental Game in Cricket",
        type: "document",
        description: "Psychology and mental preparation for batting",
        uploadDate: new Date()
      }
    ],
    curriculum: [
      {
        week: 1,
        session: 1,
        title: "Advanced Shot Making",
        objectives: ["Power hitting", "Placement techniques", "Timing improvement"],
        duration: 120
      },
      {
        week: 2,
        session: 1,
        title: "Spin Bowling Strategy",
        objectives: ["Reading spin", "Footwork against spin", "Scoring options"],
        duration: 120
      }
    ],
    requirements: [
      "Minimum 2 years cricket experience",
      "Good fitness level",
      "Own cricket equipment"
    ],
    benefits: [
      "Master advanced batting techniques",
      "Improve match performance",
      "Mental strength training",
      "Professional coaching methods"
    ],
    tags: ["advanced", "batting", "competitive"]
  },
  {
    title: "Fast Bowling Academy",
    description: "Comprehensive fast bowling program focusing on pace, accuracy, and variety. Learn from experienced coaches and develop your bowling into a weapon that can trouble any batsman.",
    category: "intermediate",
    specialization: "bowling",
    duration: {
      weeks: 10,
      sessionsPerWeek: 2
    },
    totalSessions: 20,
    price: 25000,
    maxParticipants: 10,
    currentEnrollments: 4,
    difficulty: "medium",
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-12-10'),
    isActive: true,
    materials: [
      {
        title: "Fast Bowling Biomechanics",
        type: "video",
        description: "Scientific approach to fast bowling action",
        uploadDate: new Date()
      },
      {
        title: "Fitness for Fast Bowlers",
        type: "document",
        description: "Specific fitness routines for pace bowlers",
        uploadDate: new Date()
      }
    ],
    curriculum: [
      {
        week: 1,
        session: 1,
        title: "Bowling Action Analysis",
        objectives: ["Perfect bowling action", "Run-up rhythm", "Release point"],
        duration: 100
      },
      {
        week: 2,
        session: 1,
        title: "Pace and Accuracy",
        objectives: ["Increase bowling speed", "Improve accuracy", "Control drills"],
        duration: 100
      }
    ],
    requirements: [
      "Basic bowling knowledge",
      "Good physical fitness",
      "Injury-free status"
    ],
    benefits: [
      "Increase bowling pace",
      "Improve accuracy and control",
      "Learn professional techniques",
      "Injury prevention methods"
    ],
    tags: ["bowling", "pace", "intermediate"]
  },
  {
    title: "Wicket Keeping Specialist",
    description: "Master the art of wicket keeping with this specialized program. Learn proper technique, agility training, and match awareness to become the backbone of your team.",
    category: "intermediate",
    specialization: "wicket-keeping",
    duration: {
      weeks: 6,
      sessionsPerWeek: 2
    },
    totalSessions: 12,
    price: 18000,
    maxParticipants: 6,
    currentEnrollments: 3,
    difficulty: "medium",
    startDate: new Date('2025-09-20'),
    endDate: new Date('2025-11-01'),
    isActive: true,
    materials: [
      {
        title: "Wicket Keeping Fundamentals",
        type: "video",
        description: "Complete guide to wicket keeping techniques",
        uploadDate: new Date()
      }
    ],
    curriculum: [
      {
        week: 1,
        session: 1,
        title: "Basic Technique",
        objectives: ["Stance and positioning", "Glove work", "Footwork"],
        duration: 90
      }
    ],
    requirements: [
      "Basic cricket knowledge",
      "Good hand-eye coordination",
      "Wicket keeping gloves"
    ],
    benefits: [
      "Professional keeping techniques",
      "Improved agility and reflexes",
      "Match awareness skills",
      "Leadership development"
    ],
    tags: ["wicket-keeping", "specialist", "technique"]
  },
  {
    title: "Youth Cricket Development",
    description: "Specially designed program for young cricketers aged 10-16. Focus on skill development, fun learning, and building confidence in a supportive environment.",
    category: "beginner",
    specialization: "all-rounder",
    duration: {
      weeks: 12,
      sessionsPerWeek: 2
    },
    totalSessions: 24,
    price: 20000,
    maxParticipants: 15,
    currentEnrollments: 12,
    difficulty: "easy",
    startDate: new Date('2025-09-10'),
    endDate: new Date('2025-12-02'),
    isActive: true,
    materials: [
      {
        title: "Youth Cricket Handbook",
        type: "document",
        description: "Age-appropriate cricket learning materials",
        uploadDate: new Date()
      }
    ],
    curriculum: [
      {
        week: 1,
        session: 1,
        title: "Cricket Basics for Youth",
        objectives: ["Game understanding", "Basic skills", "Teamwork"],
        duration: 75
      }
    ],
    requirements: [
      "Age 10-16 years",
      "Parental consent",
      "Basic sports kit"
    ],
    benefits: [
      "Structured skill development",
      "Physical fitness improvement",
      "Social skills and teamwork",
      "Confidence building"
    ],
    tags: ["youth", "development", "fun-learning"]
  },
  {
    title: "Professional Cricket Preparation",
    description: "Elite-level training program for aspiring professional cricketers. Intensive coaching, match simulation, and mental conditioning to prepare for competitive cricket.",
    category: "professional",
    specialization: "all-rounder",
    duration: {
      weeks: 16,
      sessionsPerWeek: 4
    },
    totalSessions: 64,
    price: 50000,
    maxParticipants: 8,
    currentEnrollments: 2,
    difficulty: "hard",
    startDate: new Date('2025-10-15'),
    endDate: new Date('2025-02-07'),
    isActive: true,
    materials: [
      {
        title: "Professional Cricket Manual",
        type: "document",
        description: "Comprehensive guide for aspiring professionals",
        uploadDate: new Date()
      },
      {
        title: "Match Analysis Videos",
        type: "video",
        description: "Professional match analysis and tactics",
        uploadDate: new Date()
      }
    ],
    curriculum: [
      {
        week: 1,
        session: 1,
        title: "Professional Standards",
        objectives: ["Elite mindset", "Physical conditioning", "Technical excellence"],
        duration: 150
      }
    ],
    requirements: [
      "High skill level",
      "Excellent fitness",
      "Commitment to professional cricket"
    ],
    benefits: [
      "Elite-level coaching",
      "Professional preparation",
      "Network with scouts",
      "Career guidance"
    ],
    tags: ["professional", "elite", "career"]
  }
];

// Create sample coaches
const createSampleCoaches = async () => {
  const sampleCoaches = [
    {
      username: "coach_rajesh",
      email: "rajesh.coach@cricketxpert.com",
      passwordHash: "hashed_password_1",
      role: "coach",
      firstName: "Rajesh",
      lastName: "Kumar",
      contactNumber: "0771234567",
      status: "active"
    },
    {
      username: "coach_priya",
      email: "priya.coach@cricketxpert.com", 
      passwordHash: "hashed_password_2",
      role: "coach",
      firstName: "Priya",
      lastName: "Fernando",
      contactNumber: "0771234568",
      status: "active"
    },
    {
      username: "coach_mike",
      email: "mike.coach@cricketxpert.com",
      passwordHash: "hashed_password_3", 
      role: "coach",
      firstName: "Mike",
      lastName: "Johnson",
      contactNumber: "0771234569",
      status: "active"
    }
  ];

  // Find existing coaches or create new ones
  const coaches = [];
  for (const coachData of sampleCoaches) {
    let coach = await User.findOne({ username: coachData.username });
    if (!coach) {
      coach = await User.create(coachData);
      console.log(`✅ Created coach: ${coach.firstName} ${coach.lastName}`);
    } else {
      console.log(`📋 Found existing coach: ${coach.firstName} ${coach.lastName}`);
    }
    coaches.push(coach);
  }
  
  return coaches;
};

// Add coaches to programs
const addSampleData = async () => {
  try {
    await connectDB();

    // Clear existing programs
    await CoachingProgram.deleteMany({});
    console.log('🗑️ Cleared existing programs');

    // Create coaches
    const coaches = await createSampleCoaches();

    // Add coach references to programs
    const programsWithCoaches = samplePrograms.map((program, index) => ({
      ...program,
      coach: coaches[index % coaches.length]._id
    }));

    // Insert programs
    const insertedPrograms = await CoachingProgram.insertMany(programsWithCoaches);
    console.log(`✅ Created ${insertedPrograms.length} sample programs`);

    console.log('\n📊 Sample Data Summary:');
    insertedPrograms.forEach((program, index) => {
      console.log(`${index + 1}. ${program.title} - ${program.category} - LKR ${program.price}`);
    });

    console.log('\n🎉 Sample data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    process.exit(1);
  }
};

// Run the script
addSampleData();
