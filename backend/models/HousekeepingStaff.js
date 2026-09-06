import mongoose from 'mongoose';

const housekeepingStaffSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: 'Housekeeping Attendant' },
  shift: { type: String, default: 'Morning (07:00 - 15:30)' },
  floor: { type: String, default: 'Floor 1 & 2' },
  status: { type: String, enum: ['On Duty', 'Off Duty', 'On Leave'], default: 'On Duty' },
  assignedRooms: { type: [String], default: [] },
  completedToday: { type: Number, default: 0 },
  avatar: { type: String },
  phone: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('HousekeepingStaff', housekeepingStaffSchema);
