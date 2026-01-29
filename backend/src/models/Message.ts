import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  readAt?: Date;
  conversationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  conversationId: {
    type: String,
    index: true
  }
}, {
  timestamps: true
});

// Generate conversation ID (unique identifier for two users)
messageSchema.pre('save', function(next) {
  if (!this.conversationId) {
    const users = [this.sender.toString(), this.recipient.toString()].sort();
    this.conversationId = `${users[0]}_${users[1]}`;
  }
  next();
});

// Index for efficient querying
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ isRead: 1, recipient: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);
