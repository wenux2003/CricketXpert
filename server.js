const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// --- IMPORTED ROUTES ---
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- MY ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes); 

// --- SERVE STATIC UPLOADED FILES ---
// makes the 'uploads' folder public //
const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));


app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Test route working!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
