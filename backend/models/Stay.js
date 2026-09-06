import mongoose from 'mongoose';

const staySchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true, unique: true }, guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true }, room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  actualCheckIn: { type: Date, default: Date.now }, expectedCheckOut: Date, actualCheckOut: Date, status: { type: String, enum: ['Active', 'Completed'], default: 'Active', index: true },
  checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
export default mongoose.model('Stay', staySchema);