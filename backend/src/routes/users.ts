import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id).select('-password');
  
  res.json({
    success: true,
    data: { user }
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  body('interests')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Interests must be an array with at least 1 item')
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

  const updateFields = req.body;
  
  // Remove fields that shouldn't be updated directly
  delete updateFields.email;
  delete updateFields.password;
  delete updateFields.dateOfBirth;
  delete updateFields.age;

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
}));

// @route   PUT /api/users/privacy
// @desc    Update privacy settings
// @access  Private
router.put('/privacy', [
  body('profileVisibility')
    .optional()
    .isIn(['public', 'friends', 'private'])
    .withMessage('Invalid profile visibility setting'),
  body('showOnlineStatus')
    .optional()
    .isBoolean()
    .withMessage('showOnlineStatus must be a boolean'),
  body('allowFriendRequests')
    .optional()
    .isBoolean()
    .withMessage('allowFriendRequests must be a boolean')
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

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    {
      $set: {
        'privacySettings': req.body
      }
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Privacy settings updated successfully',
    data: { user }
  });
}));

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  body('ageRange.min')
    .optional()
    .isInt({ min: 18, max: 70 })
    .withMessage('Minimum age must be between 18 and 70'),
  body('ageRange.max')
    .optional()
    .isInt({ min: 18, max: 70 })
    .withMessage('Maximum age must be between 18 and 70'),
  body('maxDistance')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max distance must be between 1 and 100 km'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array')
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

  // Validate age range
  if (req.body.ageRange) {
    const { min, max } = req.body.ageRange;
    if (min && max && min > max) {
      res.status(400).json({
        success: false,
        error: 'Minimum age cannot be greater than maximum age'
      });
      return;
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    {
      $set: {
        'preferences': req.body
      }
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Preferences updated successfully',
    data: { user }
  });
}));

// @route   POST /api/users/photos
// @desc    Add photo to user profile
// @access  Private
router.post('/photos', [
  body('photoUrl')
    .isURL()
    .withMessage('Please provide a valid photo URL')
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

  const { photoUrl } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { $push: { photos: photoUrl } },
    { new: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Photo added successfully',
    data: { user }
  });
}));

// @route   DELETE /api/users/photos/:photoIndex
// @desc    Remove photo from user profile
// @access  Private
router.delete('/photos/:photoIndex', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const photoIndex = parseInt(req.params.photoIndex);
  
  if (isNaN(photoIndex) || photoIndex < 0) {
    res.status(400).json({
      success: false,
      error: 'Invalid photo index'
    });
    return;
  }

  const user = await User.findById(req.user!.id);
  if (!user) {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
    return;
  }

  if (photoIndex >= user.photos.length) {
    res.status(400).json({
      success: false,
      error: 'Photo index out of range'
    });
    return;
  }

  user.photos.splice(photoIndex, 1);
  await user.save();

  res.json({
    success: true,
    message: 'Photo removed successfully',
    data: { user: user.toJSON() }
  });
}));

// @route   GET /api/users/:id
// @desc    Get public user profile by ID
// @access  Private
router.get('/:id', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id)
    .select('firstName lastName age location bio interests photos privacySettings')
    .lean();

  if (!user) {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
    return;
  }

  // Check privacy settings
  if (user.privacySettings.profileVisibility === 'private') {
    res.status(403).json({
      success: false,
      error: 'This profile is private'
    });
    return;
  }

  // If profile is friends-only, check if they are friends
  if (user.privacySettings.profileVisibility === 'friends') {
    const currentUser = await User.findById(req.user!.id);
    if (!currentUser) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    if (!currentUser.friends.some(friendId => friendId.toString() === user._id.toString())) {
      res.status(403).json({
        success: false,
        error: 'This profile is only visible to friends'
      });
      return;
    }
  }

  res.json({
    success: true,
    data: { user }
  });
}));

export default router;
