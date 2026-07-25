import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import boxesRoutes from './routes/boxesRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import testimonialsRoutes from './routes/testimonialsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import paymentsRoutes from './routes/paymentsRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import loyaltyRoutes from './routes/loyaltyRoutes.js';
import marqueeRoutes from './routes/marqueeRoutes.js';
import communityApplicationsRoutes from './routes/communityApplicationsRoutes.js';

import {
  notFound,
  errorHandler,
} from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Steffi Metz API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend connected successfully',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/boxes', boxesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/contact-messages', contactRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/marquee', marqueeRoutes);
app.use('/api/community-applications', communityApplicationsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});