// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Import files
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware setup
// 1. CORS: Allows cross-origin requests from the React frontend
app.use(cors());

// 2. Body Parser: Allows Express to read JSON data sent in the request body
app.use(express.json());

// 3. Serve uploaded files: Makes files in the 'uploads' directory accessible via URL
// We need to create the 'uploads' folder manually.
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Define Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));