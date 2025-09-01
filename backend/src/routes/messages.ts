import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import { io } from '../index';

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  // Get all messages where user is sender or recipient
  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }]
  })
  .populate('sender', 'firstName lastName photos')
  .populate('recipient', 'firstName lastName photos')
  .sort({ createdAt: -1 });

  // Group messages by conversation
  const conversations = new Map();
  
  messages.forEach(message => {
    const conversationId = message.conversationId;
    const otherUser = message.sender._id.toString() === userId 
      ? message.recipient 
      : message.sender;

    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, {
        conversationId,
        otherUser,
        lastMessage: message,
        unreadCount: 0
      });
    }

    // Count unread messages
    if (message.recipient._id.toString() === userId && !message.isRead) {
      conversations.get(conversationId).unreadCount++;
    }
  });

  const conversationsList = Array.from(conversations.values());

  res.json({
    success: true,
    data: { conversations: conversationsList }
  });
}));

// @route   GET /api/messages/:conversationId
// @desc    Get messages for a specific conversation
// @access  Private
router.get('/:conversationId', asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = req.user!.id;

  // Verify user is part of this conversation
  const message = await Message.findOne({ conversationId });
  if (!message) {
    return res.status(404).json({
      success: false,
      error: 'Conversation not found'
    });
  }

  if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied to this conversation'
    });
  }

  // Get messages for this conversation
  const messages = await Message.find({ conversationId })
    .populate('sender', 'firstName lastName photos')
    .populate('recipient', 'firstName lastName photos')
    .sort({ createdAt: 1 });

  // Mark messages as read if current user is recipient
  const unreadMessages = messages.filter(msg =>
    msg.recipient._id.toString() === userId && !msg.isRead
  );

  if (unreadMessages.length > 0) {
    await Message.updateMany(
      {
        _id: { $in: unreadMessages.map(msg => msg._id) },
        recipient: userId
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );
  }

  res.json({
    success: true,
    data: { messages }
  });
}));

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', [
  body('recipientId')
    .notEmpty()
    .withMessage('Recipient ID is required'),
  body('content')
    .trim()
    .notEmpty()
    .isLength({ max: 1000 })
    .withMessage('Message content is required and cannot exceed 1000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Invalid message type')
], asyncHandler(async (req: Request, res: Response) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { recipientId, content, messageType = 'text' } = req.body;
  const senderId = req.user!.id;

  // Check if trying to send message to self
  if (senderId === recipientId) {
    return res.status(400).json({
      success: false,
      error: 'Cannot send message to yourself'
    });
  }

  // Check if recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return res.status(404).json({
      success: false,
      error: 'Recipient not found'
    });
  }

  // Check if recipient is blocked
  const sender = await User.findById(senderId);
  if (sender!.blockedUsers.includes(recipientId)) {
    return res.status(403).json({
      success: false,
      error: 'Cannot send message to blocked user'
    });
  }

  // Check if sender is blocked by recipient
  if (recipient.blockedUsers.includes(senderId)) {
    return res.status(403).json({
      success: false,
      error: 'Cannot send message to this user'
    });
  }

  // Create message
  const message = new Message({
    sender: senderId,
    recipient: recipientId,
    content,
    messageType
  });

  await message.save();

  // Populate sender and recipient details
  await message.populate('sender', 'firstName lastName photos');
  await message.populate('recipient', 'firstName lastName photos');

  // Emit real-time message to recipient
  io.to(recipientId).emit('new_message', {
    message,
    conversationId: message.conversationId
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: { message }
  });
}));

// @route   PUT /api/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/:messageId/read', asyncHandler(async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const userId = req.user!.id;

  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({
      success: false,
      error: 'Message not found'
    });
  }

  // Check if user is the recipient
  if (message.recipient.toString() !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Cannot mark this message as read'
    });
  }

  // Mark as read
  message.isRead = true;
  message.readAt = new Date();
  await message.save();

  res.json({
    success: true,
    message: 'Message marked as read',
    data: { message }
  });
}));

// @route   DELETE /api/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/:messageId', asyncHandler(async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const userId = req.user!.id;

  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({
      success: false,
      error: 'Message not found'
    });
  }

  // Check if user is the sender
  if (message.sender.toString() !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Cannot delete this message'
    });
  }

  await message.deleteOne();

  // Notify recipient about message deletion
  io.to(message.recipient.toString()).emit('message_deleted', {
    messageId,
    conversationId: message.conversationId
  });

  res.json({
    success: true,
    message: 'Message deleted successfully'
  });
}));

// @route   GET /api/messages/unread/count
// @desc    Get unread message count
// @access  Private
router.get('/unread/count', asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const unreadCount = await Message.countDocuments({
    recipient: userId,
    isRead: false
  });

  res.json({
    success: true,
    data: { unreadCount }
  });
}));

export default router;
