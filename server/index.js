import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import doctorsRouter from './routes/doctors.js';
import appointmentsRouter from './routes/appointments.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup to allow existing React frontend
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'UNN HMS Express Backend API',
    supabaseConnected: Boolean(process.env.SUPABASE_URL),
    cloudinaryConnected: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/auth', authRouter);

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('SERVER ERROR:', err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 UNN HMS Express Server running on http://localhost:${PORT}`);
  console.log(`📡 Supabase Endpoint: ${process.env.SUPABASE_URL || 'Not Configured'}`);
});

