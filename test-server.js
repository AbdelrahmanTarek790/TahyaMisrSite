const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const positionRoutes = require('./routes/positions');
const newsRoutes = require('./routes/news');
const eventRoutes = require('./routes/events');
const mediaRoutes = require('./routes/media');
const notificationRoutes = require('./routes/notifications');

console.log('Routes imported successfully');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Tahya Misr Students Union API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    },
    error: null
  });
});

console.log('About to set up routes...');

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/positions', positionRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/notifications', notificationRoutes);

console.log('Routes set up successfully');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;