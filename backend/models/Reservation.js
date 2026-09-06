import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  reservationNumber: { type: String, unique: true, index: true }, guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true }, room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true, index: true }, checkOutDate: { type: Date, required: true, index: true },
  adults: { type: Number, default: 1, min: 1 }, children: { type: Number, default: 0, min: 0 }, numberOfAdults: Number, numberOfChildren: Number,
  status: { type: String, enum: ['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'], default: 'Pending', index: true }, totalAmount: { type: Number, required: true, min: 0 }, specialRequests: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true, toJSON: { virtuals: true, transform: (_doc, ret) => { ret.guestId = ret.guest?._id || ret.guest; ret.roomId = ret.room?._id || ret.room; delete ret.__v; return ret; } } });

reservationSchema.index({ room: 1, checkInDate: 1, checkOutDate: 1, status: 1 });
reservationSchema.pre('validate', function setOccupancyAliases(next) { this.numberOfAdults = this.numberOfAdults ?? this.adults; this.numberOfChildren = this.numberOfChildren ?? this.children; next(); });
export default mongoose.model('Reservation', reservationSchema);