import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { userId },
    secret as jwt.Secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
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
], asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array()
    });
    return;
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
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    res.status(400).json({
      success: false,
      error: 'User with this email already exists'
    });
    return;
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
  const token = generateToken(String(user._id));

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
], asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array()
    });
    return;
  }

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).exec();
  if (!user) {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
    return;
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
    return;
  }

  // Update online status
  user.isOnline = true;
  user.lastSeen = new Date();
  await user.save();

  // Generate token
  const token = generateToken(String(user._id));

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
router.post('/logout', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  // Mark user offline (best-effort). Token invalidation/blacklisting could be added later.
  await User.findByIdAndUpdate(req.user!.id, {
    $set: { isOnline: false, lastSeen: new Date() }
  });

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}));

export default router;
