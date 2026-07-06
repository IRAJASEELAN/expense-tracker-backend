require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('Database connection error: ', err));

// Routes
const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth'); // <-- WE ADDED THIS

app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes); // <-- WE ADDED THIS

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});