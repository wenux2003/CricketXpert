const mongoose = require('mongoose');
const Coach = require('./models/Coach');
const CoachingProgram = require('./models/CoachingProgram');
const User = require('./models/User');
const Ground = require('./models/Ground');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cricketxpert')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createSampleData() {
  try {
    // Create a sample user for coach
    const coachUser = new User({
      username: 'coach_john',
      email: 'john.coach@cricketxpert.com',
      passwordHash: 'hashedpassword123',
      role: 'coach',
      firstName: 'John',
      lastName: 'Smith',
      contactNumber: '+94771234567',
      address: 'Colombo, Sri Lanka',
      status: 'active'
    });

    await coachUser.save();
    console.log('Coach user created');

    // Create a coach profile
    const coach = new Coach({
      userId: coachUser._id,
      specializations: ['batting', 'all-rounder'],
      experience: 10,
      bio: 'Professional cricket coach with 10+ years of experience in developing batting techniques.',
      hourlyRate: 2500,
      rating: 4.8,
      totalReviews: 45,
      availability: [
        {
          dayOfWeek: 'Monday',
          startTime: '09:00',
          endTime: '17:00'
        },
        {
          dayOfWeek: 'Wednesday',
          startTime: '09:00',
          endTime: '17:00'
        },
        {
          dayOfWeek: 'Friday',
          startTime: '09:00',
          endTime: '17:00'
        }
      ],
      isActive: true,
      achievements: ['Former National Team Player', 'Certified Level 3 Coach']
    });

    await coach.save();
    console.log('Coach profile created');

    // Create a ground
    const ground = new Ground({
      pricePerSlot: 5000,
      description: 'Main Cricket Ground',
      groundSlot: 8,
      maxSlotPerDay: 6
    });

    await ground.save();
    console.log('Ground created');

    // Create sample coaching programs
    const programs = [
      {
        title: 'Beginner Batting Fundamentals',
        description: 'Learn the basics of batting with proper stance, grip, and shot selection. Perfect for beginners who want to start their cricket journey with a solid foundation.',
        coach: coach._id,
        category: 'beginner',
        specialization: 'batting',
        duration: {
          weeks: 8,
          sessionsPerWeek: 2
        },
        price: 15000,
        maxParticipants: 10,
        currentEnrollments: 3,
        materials: [
          {
            title: 'Batting Basics Video',
            type: 'video',
            url: 'https://example.com/video1',
            description: 'Introduction to batting stance and grip'
          },
          {
            title: 'Training Manual',
            type: 'document',
            url: 'https://example.com/manual.pdf',
            description: 'Comprehensive batting training guide'
          }
        ],
        curriculum: [
          {
            week: 1,
            session: 1,
            title: 'Introduction to Cricket Batting',
            objectives: ['Learn proper stance', 'Understand grip techniques', 'Basic safety rules'],
            duration: 90
          },
          {
            week: 1,
            session: 2,
            title: 'Defensive Shots',
            objectives: ['Master forward defense', 'Learn back foot defense', 'Practice leaving the ball'],
            duration: 90
          }
        ],
        requirements: ['Basic fitness level', 'Cricket gear (provided if needed)', 'Commitment to attend all sessions'],
        benefits: ['Solid batting foundation', 'Improved hand-eye coordination', 'Better understanding of the game', 'Confidence at the crease'],
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-29'),
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400',
        tags: ['batting', 'beginners', 'fundamentals'],
        difficulty: 'easy'
      },
      {
        title: 'Advanced Bowling Techniques',
        description: 'Master different bowling styles including pace, spin, and swing bowling. Designed for intermediate to advanced players looking to enhance their bowling skills.',
        coach: coach._id,
        category: 'advanced',
        specialization: 'bowling',
        duration: {
          weeks: 12,
          sessionsPerWeek: 2
        },
        price: 25000,
        maxParticipants: 8,
        currentEnrollments: 5,
        materials: [
          {
            title: 'Bowling Action Analysis',
            type: 'video',
            url: 'https://example.com/bowling-video',
            description: 'Professional bowling action breakdown'
          }
        ],
        curriculum: [
          {
            week: 1,
            session: 1,
            title: 'Bowling Action Fundamentals',
            objectives: ['Perfect bowling action', 'Learn different grips', 'Understand bowling mechanics'],
            duration: 120
          }
        ],
        requirements: ['Previous cricket experience', 'Good physical fitness', 'Own bowling boots'],
        benefits: ['Varied bowling arsenal', 'Better accuracy and pace', 'Match situation awareness', 'Professional bowling action'],
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-05-10'),
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        tags: ['bowling', 'advanced', 'pace', 'spin'],
        difficulty: 'hard'
      },
      {
        title: 'All-Rounder Development Program',
        description: 'Comprehensive training covering batting, bowling, and fielding skills. Perfect for players who want to become complete cricketers.',
        coach: coach._id,
        category: 'intermediate',
        specialization: 'all-rounder',
        duration: {
          weeks: 16,
          sessionsPerWeek: 3
        },
        price: 35000,
        maxParticipants: 12,
        currentEnrollments: 7,
        materials: [
          {
            title: 'Complete Cricket Guide',
            type: 'document',
            url: 'https://example.com/complete-guide.pdf',
            description: 'Comprehensive guide covering all aspects of cricket'
          },
          {
            title: 'Fielding Drills Video',
            type: 'video',
            url: 'https://example.com/fielding-drills',
            description: 'Professional fielding training exercises'
          }
        ],
        curriculum: [
          {
            week: 1,
            session: 1,
            title: 'Assessment and Goal Setting',
            objectives: ['Skill assessment', 'Personal goal setting', 'Training plan creation'],
            duration: 90
          },
          {
            week: 1,
            session: 2,
            title: 'Batting Fundamentals Review',
            objectives: ['Review batting basics', 'Identify improvement areas', 'Practice drills'],
            duration: 90
          }
        ],
        requirements: ['Basic cricket knowledge', 'Complete cricket kit', 'High commitment level'],
        benefits: ['Well-rounded cricket skills', 'Match readiness', 'Leadership qualities', 'Team player mentality'],
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-06-21'),
        imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
        tags: ['all-rounder', 'comprehensive', 'batting', 'bowling', 'fielding'],
        difficulty: 'medium'
      },
      {
        title: 'Wicket Keeping Masterclass',
        description: 'Specialized training for aspiring wicket keepers. Learn the art of keeping with proper technique, positioning, and decision making.',
        coach: coach._id,
        category: 'intermediate',
        specialization: 'wicket-keeping',
        duration: {
          weeks: 10,
          sessionsPerWeek: 2
        },
        price: 20000,
        maxParticipants: 6,
        currentEnrollments: 2,
        materials: [
          {
            title: 'Wicket Keeping Techniques',
            type: 'video',
            url: 'https://example.com/wicket-keeping',
            description: 'Professional wicket keeping demonstrations'
          }
        ],
        curriculum: [
          {
            week: 1,
            session: 1,
            title: 'Basic Wicket Keeping Stance',
            objectives: ['Proper stance', 'Glove positioning', 'Footwork basics'],
            duration: 90
          }
        ],
        requirements: ['Basic cricket knowledge', 'Wicket keeping gloves', 'Pads and protection gear'],
        benefits: ['Professional keeping technique', 'Quick reflexes', 'Game awareness', 'Leadership behind stumps'],
        startDate: new Date('2024-02-20'),
        endDate: new Date('2024-04-30'),
        imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=400',
        tags: ['wicket-keeping', 'specialized', 'technique'],
        difficulty: 'medium'
      },
      {
        title: 'Youth Cricket Development',
        description: 'Fun and engaging cricket program designed specifically for young players aged 8-14. Focus on fundamental skills and love for the game.',
        coach: coach._id,
        category: 'beginner',
        specialization: 'all-rounder',
        duration: {
          weeks: 6,
          sessionsPerWeek: 2
        },
        price: 12000,
        maxParticipants: 15,
        currentEnrollments: 8,
        materials: [
          {
            title: 'Youth Cricket Fun Activities',
            type: 'document',
            url: 'https://example.com/youth-activities.pdf',
            description: 'Fun cricket games and activities for young players'
          }
        ],
        curriculum: [
          {
            week: 1,
            session: 1,
            title: 'Cricket Introduction and Safety',
            objectives: ['Learn about cricket', 'Safety guidelines', 'Basic equipment'],
            duration: 60
          }
        ],
        requirements: ['Age 8-14 years', 'Basic sports gear', 'Parental consent'],
        benefits: ['Love for cricket', 'Basic skills development', 'Teamwork', 'Physical fitness', 'Social skills'],
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-03-23'),
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        tags: ['youth', 'beginners', 'fun', 'development'],
        difficulty: 'easy'
      }
    ];

    for (const programData of programs) {
      const program = new CoachingProgram(programData);
      await program.save();
      console.log(`Created program: ${program.title}`);
    }

    console.log('All sample data created successfully!');
    console.log('You can now test the frontend application.');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    mongoose.connection.close();
  }
}

createSampleData();
