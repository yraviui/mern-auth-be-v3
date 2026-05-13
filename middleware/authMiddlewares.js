import JWT from 'jsonwebtoken';
import UserModel from '../models/users.js';

// protect routes - only allow access if user is authenticated
export const isRequiredAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
        if (!token) {
            return res.status(401).send({ success: false, message: 'No token provided, authorization denied' });
        }
        try {
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            req.user = await UserModel.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).send({ success: false, message: 'Token is not valid' });
        }
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(401).send({ success: false, message: 'Token is not valid' });
    }
}

// admin routes - only allow access if user is authenticated and has admin role
export const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
        if (!token) {
            return res.status(401).send({ success: false, message: 'No token provided, authorization denied' });
        }
        try {
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findById(decoded.id).select('-password');
            if (user && user.role === 'admin') {
                req.user = user;
                next();
            } else {
                return res.status(403).send({ success: false, message: 'Access denied, admin only' });
            }
        } catch (error) {
            return res.status(401).send({ success: false, message: 'Token is not valid' });
        }
    } catch (error) {
        console.error('Error in admin auth middleware:', error);
        res.status(401).send({ success: false, message: 'Token is not valid' });
    }
}

// customercare routes - only allow access if user is authenticated and has customercare role
export const isCustomerCare = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
        if (!token) {
            return res.status(401).send({ success: false, message: 'No token provided, authorization denied' });
        }
        try {
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findById(decoded.id).select('-password');
            if (user && user.role === 'customercare') {
                req.user = user;
                next();
            }
            else {
                return res.status(403).send({ success: false, message: 'Access denied, customer care only' });
            }
        } catch (error) {
            return res.status(401).send({ success: false, message: 'Token is not valid' });
        }
    } catch (error) {
        console.error('Error in customer care auth middleware:', error);
        res.status(401).send({ success: false, message: 'Token is not valid' });
    }
}