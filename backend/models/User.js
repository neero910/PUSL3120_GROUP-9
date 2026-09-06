import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['Administrator', 'Manager', 'Receptionist', 'Restaurant Staff'], default: 'Receptionist' },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true, toJSON: { virtuals: true, transform: (_doc, ret) => { delete ret.password; delete ret.__v; return ret; } } });

export default mongoose.model('User', userSchema);