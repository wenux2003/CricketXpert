const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('/config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const playerRoutes = require('./routes/players');
app.use('/api/players', playerRoutes);

app.get('/', (req, res) => {
  res.send('CricketXpert API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
