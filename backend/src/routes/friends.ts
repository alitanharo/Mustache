import express, { Request, Response } from 'express';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// @route   GET /api/friends
// @desc    Get user's friends list
// @access  Private
router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id)
    .populate('friends', 'firstName lastName age location bio interests photos isOnline lastSeen')
    .select('friends');

  res.json({
    success: true,
    data: { friends: user?.friends || [] }
  });
}));

// @route   GET /api/friends/requests
// @desc    Get incoming friend requests
// @access  Private
router.get('/requests', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id)
    .populate('friendRequests', 'firstName lastName age location bio interests photos')
    .select('friendRequests');

  res.json({
    success: true,
    data: { friendRequests: user?.friendRequests || [] }
  });
}));

// @route   GET /api/friends/sent
// @desc    Get sent friend requests
// @access  Private
router.get('/sent', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id)
    .populate('sentFriendRequests', 'firstName lastName age location bio interests photos')
    .select('sentFriendRequests');

  res.json({
    success: true,
    data: { sentFriendRequests: user?.sentFriendRequests || [] }
  });
}));

// @route   POST /api/friends/request/:userId
// @desc    Send friend request
// @access  Private
router.post('/request/:userId', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user!.id;

  // Check if trying to send request to self
  if (targetUserId === currentUserId) {
    res.status(400).json({
      success: false,
      error: 'Cannot send friend request to yourself'
    });
    return;
  }

  // Check if target user exists
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    res.status(404).json({
      success: false,
      error: 'User not found'
    });
    return;
  }

  // Check if target user allows friend requests
  if (!targetUser.privacySettings.allowFriendRequests) {
    res.status(403).json({
      success: false,
      error: 'This user is not accepting friend requests'
    });
    return;
  }

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    res.status(404).json({
      success: false,
      error: 'Current user not found'
    });
    return;
  }

  // Check if already friends
  if (currentUser.friends.some(id => id.toString() === targetUserId)) {
    res.status(400).json({
      success: false,
      error: 'You are already friends with this user'
    });
    return;
  }

  // Check if request already sent
  if (currentUser.sentFriendRequests.some(id => id.toString() === targetUserId)) {
    res.status(400).json({
      success: false,
      error: 'Friend request already sent'
    });
    return;
  }

  // Check if request already received
  if (currentUser.friendRequests.some(id => id.toString() === targetUserId)) {
    res.status(400).json({
      success: false,
      error: 'This user has already sent you a friend request'
    });
    return;
  }

  // Add to sent requests for current user
  await User.findByIdAndUpdate(currentUserId, {
    $push: { sentFriendRequests: targetUserId }
  });

  // Add to received requests for target user
  await User.findByIdAndUpdate(targetUserId, {
    $push: { friendRequests: currentUserId }
  });

  res.json({
    success: true,
    message: 'Friend request sent successfully'
  });
}));

// @route   POST /api/friends/accept/:userId
// @desc    Accept friend request
// @access  Private
router.post('/accept/:userId', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const senderUserId = req.params.userId;
  const currentUserId = req.user!.id;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    res.status(404).json({
      success: false,
      error: 'Current user not found'
    });
    return;
  }

  // Check if request exists
  if (!currentUser.friendRequests.some(id => id.toString() === senderUserId)) {
    res.status(400).json({
      success: false,
      error: 'No friend request from this user'
    });
    return;
  }

  // Remove from friend requests
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { friendRequests: senderUserId }
  });

  // Remove from sent friend requests for sender
  await User.findByIdAndUpdate(senderUserId, {
    $pull: { sentFriendRequests: currentUserId }
  });

  // Add to friends for both users
  await User.findByIdAndUpdate(currentUserId, {
    $push: { friends: senderUserId }
  });

  await User.findByIdAndUpdate(senderUserId, {
    $push: { friends: currentUserId }
  });

  res.json({
    success: true,
    message: 'Friend request accepted successfully'
  });
}));

// @route   POST /api/friends/reject/:userId
// @desc    Reject friend request
// @access  Private
router.post('/reject/:userId', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const senderUserId = req.params.userId;
  const currentUserId = req.user!.id;

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    res.status(404).json({
      success: false,
      error: 'Current user not found'
    });
    return;
  }

  // Check if request exists
  if (!currentUser.friendRequests.some(id => id.toString() === senderUserId)) {
    res.status(400).json({
      success: false,
      error: 'No friend request from this user'
    });
    return;
  }

  // Remove from friend requests
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { friendRequests: senderUserId }
  });

  // Remove from sent friend requests for sender
  await User.findByIdAndUpdate(senderUserId, {
    $pull: { sentFriendRequests: currentUserId }
  });

  res.json({
    success: true,
    message: 'Friend request rejected successfully'
  });
}));

// @route   DELETE /api/friends/:userId
// @desc    Remove friend
// @access  Private
router.delete('/:userId', asyncHandler(async (req: Request, res: Response) => {
  const friendUserId = req.params.userId;
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    return res.status(404).json({
      success: false,
      error: 'Current user not found'
    });
  }

  // Check if they are friends
  if (!currentUser.friends.some(id => id.toString() === friendUserId)) {
    return res.status(400).json({
      success: false,
      error: 'This user is not your friend'
    });
  }

  // Remove from friends for both users
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { friends: friendUserId }
  });

  await User.findByIdAndUpdate(friendUserId, {
    $pull: { friends: currentUserId }
  });

  return res.json({
    success: true,
    message: 'Friend removed successfully'
  });
}));

// @route   POST /api/friends/cancel/:userId
// @desc    Cancel sent friend request
// @access  Private
router.post('/cancel/:userId', asyncHandler(async (req: Request, res: Response) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    return res.status(404).json({
      success: false,
      error: 'Current user not found'
    });
  }

  // Check if request was sent
  if (!currentUser.sentFriendRequests.some(id => id.toString() === targetUserId)) {
    return res.status(400).json({
      success: false,
      error: 'No friend request sent to this user'
    });
  }

  // Remove from sent friend requests for current user
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { sentFriendRequests: targetUserId }
  });

  // Remove from received friend requests for target user
  await User.findByIdAndUpdate(targetUserId, {
    $pull: { friendRequests: currentUserId }
  });

  return res.json({
    success: true,
    message: 'Friend request cancelled successfully'
  });
}));

// @route   POST /api/friends/block/:userId
// @desc    Block user
// @access  Private
router.post('/block/:userId', asyncHandler(async (req: Request, res: Response) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  // Check if trying to block self
  if (targetUserId === currentUserId) {
    return res.status(400).json({
      success: false,
      error: 'Cannot block yourself'
    });
  }

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    return res.status(404).json({
      success: false,
      error: 'Current user not found'
    });
  }

  // Check if already blocked
  if (currentUser.blockedUsers.some(id => id.toString() === targetUserId)) {
    return res.status(400).json({
      success: false,
      error: 'User is already blocked'
    });
  }

  // Remove from friends if they were friends
  if (currentUser.friends.some(id => id.toString() === targetUserId)) {
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { friends: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { friends: currentUserId }
    });
  }

  // Remove from friend requests if any
  if (currentUser.friendRequests.some(id => id.toString() === targetUserId)) {
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { friendRequests: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { sentFriendRequests: currentUserId }
    });
  }

  // Remove from sent friend requests if any
  if (currentUser.sentFriendRequests.some(id => id.toString() === targetUserId)) {
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { sentFriendRequests: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { friendRequests: currentUserId }
    });
  }

  // Add to blocked users
  await User.findByIdAndUpdate(currentUserId, {
    $push: { blockedUsers: targetUserId }
  });

  return res.json({
    success: true,
    message: 'User blocked successfully'
  });
}));

// @route   POST /api/friends/unblock/:userId
// @desc    Unblock user
// @access  Private
router.post('/unblock/:userId', asyncHandler(async (req: Request, res: Response) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    return res.status(404).json({
      success: false,
      error: 'Current user not found'
    });
  }

  // Check if user is blocked
  if (!currentUser.blockedUsers.some(id => id.toString() === targetUserId)) {
    return res.status(400).json({
      success: false,
      error: 'User is not blocked'
    });
  }

  // Remove from blocked users
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { blockedUsers: targetUserId }
  });

  return res.json({
    success: true,
    message: 'User unblocked successfully'
  });
}));

export default router;
