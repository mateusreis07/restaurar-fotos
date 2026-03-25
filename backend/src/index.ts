import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import paymentRoutes from './routes/payment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());

// Webhook handling must be before express.json() because it needs raw body
app.use('/api/webhook', paymentRoutes);

// For all other routes, parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', uploadRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Aura Recall Backend Running' });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
