const express = require('express');
const cors = require('cors');
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

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use('/api/repairs', repairRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/users', userRoutes);


const playerRoutes = require('./routes/players');
app.use('/api/players', playerRoutes);

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Test route working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
