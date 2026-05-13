import express from 'express';
import { registerController, loginController, verifyEmailController, resetPasswordController, refreshTokenController, forgotPasswordController } from '../controllers/authController.js';
import { isAdmin, isCustomerCare, isRequiredAuth } from '../middleware/authMiddlewares.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/verify-email', verifyEmailController);
router.post('/login', loginController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);
router.post('/refresh-token', refreshTokenController);

router.get('/user-auth', isRequiredAuth, (req, res) => {
    res.send({ ok: true });
});

router.get('/admin-auth', isRequiredAuth, isAdmin, (req, res) => {
    if (req.user.role === 'admin') {
        res.send({ ok: true });
    } else {
        res.status(403).send({ message: 'Access denied, admin only' });
    }
});

router.get('/customercare-auth', isRequiredAuth, isCustomerCare, (req, res) => {
    if (req.user.role === 'customercare') {
        res.send({ ok: true });
    } else {
        res.status(403).send({ message: 'Access denied, customercare only' });
    }
});

export default router;