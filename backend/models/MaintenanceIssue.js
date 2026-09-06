import mongoose from 'mongoose';

const maintenanceIssueSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, trim: true },
  category: { type: String, default: 'General Repair' },
  title: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Normal', 'High', 'Urgent'], default: 'Normal' },
  reportedBy: { type: String, default: 'Staff Member' },
  reportedAt: { type: String, default: 'Today' },
  assignedTechnician: { type: String, default: 'Unassigned' },
  status: { type: String, enum: ['Open', 'In Progress', 'Pending Parts', 'Resolved'], default: 'Open' },
  notes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('MaintenanceIssue', maintenanceIssueSchema);
