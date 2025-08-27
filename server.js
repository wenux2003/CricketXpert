const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import the path module
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ADD THIS LINE ---
// Make the 'uploads' folder public so images can be accessed by their URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const playerRoutes = require('./routes/players');
app.use('/api/players', playerRoutes);
// Routes order and product 
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/Payments', require('./routes/paymentRoutes'));


app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Test route working!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
