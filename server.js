const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//for user
const userRoutes = require("./routes/userRoutes");
app.use('/api/users', userRoutes);

//for Coach
const coachRoutes = require("./routes/coachRoutes");
app.use("/api/coaches", coachRoutes);

//for coach availabity
const coachAvailabilityRoutes = require('./routes/coachAvailabilityRoutes');
app.use('/api/coach-availability', coachAvailabilityRoutes);

//for coaching programs

const coachingProgramRoutes = require('./routes/coachingProgramRoutes');
app.use('/api/coaching-programs', coachingProgramRoutes);

//for enrollments
const enrollmentRoutes = require('./routes/enrollmentRoutes');
app.use('/api/enrollments', enrollmentRoutes);

//for sessions
const sessionRoutes = require('./routes/sessionRoutes');
app.use('/api/sessions', sessionRoutes);

//for ground
const groundRoutes = require('./routes/groundRoutes');
app.use('/api/grounds', groundRoutes);

//for feedbacks
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedbacks', feedbackRoutes);

//for noifications
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

//for certificates
const certificateRoutes = require('./routes/certificateRoutes');
app.use('/api/certificates', certificateRoutes);






app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Test route working!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
