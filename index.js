import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRouter.js';
import contactRoutes from './routes/contactRoutes.js';
import userRotes from './routes/userRotes.js'

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({message: 'Hello World!'});
});

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/user', userRotes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});