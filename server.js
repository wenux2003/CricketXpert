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

// Coach routes
const coachRoutes = require('./routes/Coaches'); // ✅ Make sure file name matches exactly
app.use("/Coaches", coachRoutes);
// Routes
const playerRoutes = require('./routes/players');
app.use('/api/players', playerRoutes);

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Test route working!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
