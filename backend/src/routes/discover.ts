import express, { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// @route   GET /api/discover
// @desc    Discover potential friends based on preferences
// @access  Private
router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('ageMin')
    .optional()
    .isInt({ min: 18, max: 70 })
    .withMessage('Minimum age must be between 18 and 70'),
  query('ageMax')
    .optional()
    .isInt({ min: 18, max: 70 })
    .withMessage('Maximum age must be between 18 and 70'),
  query('maxDistance')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max distance must be between 1 and 100 km'),
  query('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  query('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty if provided')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const currentUserId = req.user!.id;
  const {
    page = 1,
    limit = 20,
    ageMin,
    ageMax,
    maxDistance,
    interests,
    location
  } = req.query;

  // Get current user's preferences and blocked users
  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Build query filters
  const filters: any = {
    _id: { $ne: currentUserId }, // Exclude current user
    'privacySettings.profileVisibility': { $ne: 'private' }, // Exclude private profiles
    'privacySettings.allowFriendRequests': true // Only users who accept friend requests
  };

  // Exclude blocked users and users who blocked current user
  filters._id.$nin = [
    ...currentUser.blockedUsers,
    ...currentUser.friends,
    ...currentUser.friendRequests,
    ...currentUser.sentFriendRequests
  ];

  // Age filter
  if (ageMin || ageMax) {
    filters.age = {};
    if (ageMin) filters.age.$gte = parseInt(ageMin as string);
    if (ageMax) filters.age.$lte = parseInt(ageMax as string);
  } else {
    // Use user's preferences if no filters provided
    if (currentUser.preferences.ageRange) {
      filters.age = {
        $gte: currentUser.preferences.ageRange.min,
        $lte: currentUser.preferences.ageRange.max
      };
    }
  }

  // Location filter (simple text matching for now)
  if (location) {
    filters.location = { $regex: location as string, $options: 'i' };
  }

  // Interests filter
  if (interests && Array.isArray(interests) && interests.length > 0) {
    filters.interests = { $in: interests };
  } else if (currentUser.preferences.interests && currentUser.preferences.interests.length > 0) {
    // Use user's preferred interests if no filters provided
    filters.interests = { $in: currentUser.preferences.interests };
  }

  // Calculate skip value for pagination
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Execute query with pagination
  const users = await User.find(filters)
    .select('firstName lastName age location bio interests photos privacySettings')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit as string))
    .lean();

  // Get total count for pagination
  const totalUsers = await User.countDocuments(filters);

  // Calculate pagination info
  const totalPages = Math.ceil(totalUsers / parseInt(limit as string));
  const hasNextPage = parseInt(page as string) < totalPages;
  const hasPrevPage = parseInt(page as string) > 1;

  // Filter out friends-only profiles if user is not friends with them
  const filteredUsers = users.filter(user => {
    if (user.privacySettings.profileVisibility === 'friends') {
      return false; // Skip friends-only profiles in discover
    }
    return true;
  });

  res.json({
    success: true,
    data: {
      users: filteredUsers,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages,
        totalUsers,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit as string)
      }
    }
  });
}));

// @route   GET /api/discover/search
// @desc    Search for users by name or location
// @access  Private
router.get('/search', [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('Search query is required'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const currentUserId = req.user.id;
  const { q: searchQuery, page = 1, limit = 20 } = req.query;

  // Get current user's blocked users and friends
  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Build search query
  const searchFilters: any = {
    _id: { $ne: currentUserId },
    'privacySettings.profileVisibility': { $ne: 'private' },
    $or: [
      { firstName: { $regex: searchQuery, $options: 'i' } },
      { lastName: { $regex: searchQuery, $options: 'i' } },
      { location: { $regex: searchQuery, $options: 'i' } },
      { interests: { $in: [new RegExp(searchQuery as string, 'i')] } }
    ]
  };

  // Exclude blocked users and friends
  searchFilters._id.$nin = [
    ...currentUser.blockedUsers,
    ...currentUser.friends
  ];

  // Calculate skip value for pagination
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Execute search query
  const users = await User.find(searchFilters)
    .select('firstName lastName age location bio interests photos privacySettings')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit as string))
    .lean();

  // Get total count for pagination
  const totalUsers = await User.countDocuments(searchFilters);

  // Calculate pagination info
  const totalPages = Math.ceil(totalUsers / parseInt(limit as string));
  const hasNextPage = parseInt(page as string) < totalPages;
  const hasPrevPage = parseInt(page as string) > 1;

  res.json({
    success: true,
    data: {
      users,
      searchQuery,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages,
        totalUsers,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit as string)
      }
    }
  });
}));

// @route   GET /api/discover/recommendations
// @desc    Get personalized friend recommendations
// @access  Private
router.get('/recommendations', asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;

  // Get current user's preferences and data
  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Build recommendation query based on user preferences
  const recommendationFilters: any = {
    _id: { $ne: currentUserId },
    'privacySettings.profileVisibility': { $ne: 'private' },
    'privacySettings.allowFriendRequests': true
  };

  // Exclude blocked users and existing connections
  recommendationFilters._id.$nin = [
    ...currentUser.blockedUsers,
    ...currentUser.friends,
    ...currentUser.friendRequests,
    ...currentUser.sentFriendRequests
  ];

  // Add preference-based filters
  if (currentUser.preferences.ageRange) {
    recommendationFilters.age = {
      $gte: currentUser.preferences.ageRange.min,
      $lte: currentUser.preferences.ageRange.max
    };
  }

  if (currentUser.preferences.interests && currentUser.preferences.interests.length > 0) {
    recommendationFilters.interests = { $in: currentUser.preferences.interests };
  }

  // Get recommendations with scoring
  const recommendations = await User.aggregate([
    { $match: recommendationFilters },
    {
      $addFields: {
        // Calculate match score based on interests overlap
        matchScore: {
          $size: {
            $setIntersection: [
              '$interests',
              currentUser.interests || []
            ]
          }
        }
      }
    },
    {
      $sort: {
        matchScore: -1,
        createdAt: -1
      }
    },
    {
      $limit: 20
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        age: 1,
        location: 1,
        bio: 1,
        interests: 1,
        photos: 1,
        privacySettings: 1,
        matchScore: 1
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      recommendations,
      userPreferences: currentUser.preferences
    }
  });
}));

export default router;
