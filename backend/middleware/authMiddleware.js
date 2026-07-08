import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes by verifying JWT tokens in Authorization headers.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer prefix
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token value
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token using JWT_SECRET env key
      const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_string';
      const decoded = jwt.verify(token, secret);

      // Find user matching decoded id and exclude password hash from metadata
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'The user belonging to this token no longer exists.',
        });
      }

      return next();
    } catch (error) {
      console.error('JWT Auth Middleware verification failed:', error.message);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired authorization token.',
      });
    }
  }

  // Token missing
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. No authorization token was provided.',
    });
  }
};
