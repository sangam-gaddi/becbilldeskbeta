import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudent extends Document {
  usn: string;
  studentName: string;
  department: string;
  semester: string;
  degree: string;
  stdType: string;
  casteCat: string;
  csn: string;
  idNo: string;
  admissionID: string;
  paymentCategory: string;
  
  // Authentication fields
  email?: string;
  password?: string;
  recoveryPhraseHash?: string;
  isRegistered: boolean;
  
  // Chat-specific fields
  profilePicture?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
  usn: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    index: true 
  },
  studentName: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  degree: { type: String, required: true },
  stdType: { type: String, required: true },
  casteCat: { type: String, required: true },
  csn: { type: String, required: true },
  idNo: { type: String, required: true },
  admissionID: { type: String, required: true },
  paymentCategory: { 
    type: String, 
    required: true,
    enum: ['KCET', 'COMEDK', 'Management']
  },
  
  // Authentication
  email: { 
    type: String, 
    sparse: true,
    lowercase: true,
    index: true
  },
  password: { type: String },
  recoveryPhraseHash: { type: String },
  isRegistered: { 
    type: Boolean, 
    default: false,
    index: true
  },
  
  // Chat fields
  profilePicture: { 
    type: String,
    default: null
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  collection: 'students'
});

// Indexes for performance
StudentSchema.index({ usn: 1, isRegistered: 1 });
StudentSchema.index({ email: 1 }, { sparse: true });
StudentSchema.index({ isOnline: 1 });

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
