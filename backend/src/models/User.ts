import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  location: string;
  bio: string;
  interests: string[];
  photos: string[];
  age: number;
  isOnline: boolean;
  lastSeen: Date;
  friends: mongoose.Types.ObjectId[];
  friendRequests: mongoose.Types.ObjectId[];
  sentFriendRequests: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
  };
  preferences: {
    ageRange: {
      min: number;
      max: number;
    };
    maxDistance: number;
    interests: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  interests: [{
    type: String,
    trim: true
  }],
  photos: [{
    type: String,
    default: []
  }],
  age: {
    type: Number,
    required: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  sentFriendRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    showOnlineStatus: {
      type: Boolean,
      default: true
    },
    allowFriendRequests: {
      type: Boolean,
      default: true
    }
  },
  preferences: {
    ageRange: {
      min: {
        type: Number,
        default: 18,
        min: 18
      },
      max: {
        type: Number,
        default: 70,
        max: 70
      }
    },
    maxDistance: {
      type: Number,
      default: 50,
      min: 1,
      max: 100
    },
    interests: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password and calculate age
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Calculate age
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      this.age = age;
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for search optimization
userSchema.index({ 
  location: 'text', 
  interests: 'text', 
  bio: 'text' 
});

userSchema.index({ 
  age: 1, 
  location: 1, 
  interests: 1 
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model<IUser>('User', userSchema);
