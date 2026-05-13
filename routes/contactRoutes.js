import express from 'express';
import { contactController } from '../controllers/contactController.js';

const router = express.Router();

router.post('/contact-form', contactController);

export default router;