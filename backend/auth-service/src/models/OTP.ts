
import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  identifier: string; // email or phone
  type: 'email' | 'phone';
  code: string;
  purpose: 'registration' | 'login' | 'password-reset';
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema({
  identifier: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  },
  code: {
    type: String,
    required: true,
    length: 6 
  },
  purpose: {
    type: String,
    enum: ['registration', 'login', 'password-reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } 
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  }
}, {
  timestamps: true
});


OTPSchema.index({ identifier: 1, type: 1, purpose: 1 });

export default mongoose.model<IOTP>('OTP', OTPSchema);
