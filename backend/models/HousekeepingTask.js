import mongoose from 'mongoose';

const housekeepingTaskSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, trim: true },
  roomType: { type: String, default: 'Standard' },
  floor: { type: Number, default: 1 },
  taskType: { type: String, default: 'Daily Turnover' },
  priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
  stage: { type: String, enum: ['Dirty / Needs Clean', 'In Progress', 'Clean & Ready', 'Inspection Required', 'Out of Order'], default: 'Dirty / Needs Clean' },
  assignedTo: { type: String, default: 'Unassigned' },
  dueTime: { type: String, default: '15:00' },
  startedAt: { type: String, default: null },
  checklist: [{
    id: String,
    label: String,
    completed: { type: Boolean, default: false }
  }],
  notes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('HousekeepingTask', housekeepingTaskSchema);
