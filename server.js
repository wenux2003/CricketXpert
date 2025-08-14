const express = require('express');
const connectDB = require('./config/db');
const repairRoutes = require('./routes/repairRequestRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/repairs', repairRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
