import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('interests')
    .isArray({ min: 3 })
    .withMessage('Please select at least 3 interests')
], asyncHandler(async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    location,
    interests
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User with this email already exists'
    });
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    location,
    interests
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id.toString());

  // Return user data (without password) and token
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        location: user.location,
        bio: user.bio,
        interests: user.interests,
        photos: user.photos,
        privacySettings: user.privacySettings,
        preferences: user.preferences
      },
      token
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], asyncHandler(async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Update online status
  user.isOnline = true;
  user.lastSeen = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id.toString());

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        location: user.location,
        bio: user.bio,
        interests: user.interests,
        photos: user.photos,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        privacySettings: user.privacySettings,
        preferences: user.preferences
      },
      token
    }
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  // This endpoint would typically be called when user logs out
  // You might want to add token blacklisting here in the future
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  // This will be protected by auth middleware
  // req.user will contain the authenticated user
  
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}));

export default router;
