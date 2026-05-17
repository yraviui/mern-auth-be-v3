import express from 'express';
import { contactController, contactSalesController } from '../controllers/contactController.js';

const router = express.Router();

router.post('/contact-form', contactController);
router.post('/contact-sales', contactSalesController);

export default router;