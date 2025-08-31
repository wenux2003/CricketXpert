const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import models to register them
require('./models/User');
require('./models/Coach');
require('./models/CoachingProgram');
require('./models/ProgramEnrollment');
require('./models/Session');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:4173', 'http://127.0.0.1:5173'],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Import routes
const coachingProgramRoutes = require('./routes/coachingPrograms');
const programEnrollmentRoutes = require('./routes/programEnrollments');
const sessionRoutes = require('./routes/sessions');
const userRoutes = require('./routes/users');
const coachRoutes = require('./routes/coaches');
const syncRoutes = require('./routes/sync');

// Mount routes
app.use('/api/programs', coachingProgramRoutes);
app.use('/api/enrollments', programEnrollmentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/sync', syncRoutes);








app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Test route working!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
