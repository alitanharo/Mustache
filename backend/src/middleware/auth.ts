import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({
          error: 'Server misconfigured: JWT_SECRET is not defined.'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, secret) as any;
      
      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Token is valid but user not found.' 
        });
      }

      // Add user to request object
      req.user = user;
      next();
      return;
    } catch (error) {
      return res.status(401).json({ 
        error: 'Invalid token.' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Server error in authentication.' 
    });
  }
};

// Optional auth middleware for routes that can work with or without auth
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          return next();
        }

        const decoded = jwt.verify(token, secret) as any;
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        console.log('Invalid token in optional auth, continuing without user');
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Admin middleware (for future use)
export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authMiddleware(req, res, async () => {
      // Add admin check logic here when needed
      // if (req.user.role !== 'admin') {
      //   return res.status(403).json({ error: 'Admin access required.' });
      // }
      next();
    });
  } catch (error) {
    next(error);
  }
};
