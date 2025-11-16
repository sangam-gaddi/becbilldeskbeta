import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage extends Document {
  type: 'global' | 'private';
  senderUsn: string;
  senderName: string;
  senderProfilePic?: string;
  
  // For private messages
  recipientUsn?: string;
  recipientName?: string;
  
  message: string;
  readBy: string[];
  
  // Auto-delete after 7 days
  expiresAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['global', 'private'],
    required: true,
    index: true
  },
  senderUsn: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderProfilePic: {
    type: String,
    default: null
  },
  
  // Private message fields
  recipientUsn: {
    type: String,
    uppercase: true,
    sparse: true,
    index: true
  },
  recipientName: {
    type: String
  },
  
  message: {
    type: String,
    required: true,
    maxlength: 1000 // Limit message length
  },
  
  readBy: [{
    type: String,
    uppercase: true
  }],
  
  // Auto-delete after 7 days
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    index: { expires: 0 } // TTL index
  }
}, {
  timestamps: true,
  collection: 'chatmessages'
});

// Indexes for efficient queries
ChatMessageSchema.index({ type: 1, createdAt: -1 });
ChatMessageSchema.index({ senderUsn: 1, recipientUsn: 1, createdAt: -1 });
ChatMessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

const ChatMessage: Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessage;
