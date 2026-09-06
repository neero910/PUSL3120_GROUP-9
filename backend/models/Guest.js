import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true }, lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true }, phone: { type: String, required: true, trim: true, index: true },
  nicPassport: String, identificationType: String, identificationNumber: String, address: String, nationality: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true, toJSON: { virtuals: true, transform: (_doc, ret) => { delete ret.__v; return ret; } } });

guestSchema.virtual('fullName').get(function fullName() { return `${this.firstName} ${this.lastName}`; });
export default mongoose.model('Guest', guestSchema);