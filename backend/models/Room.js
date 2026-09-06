import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, trim: true, index: true },
  type: { type: String, required: true, trim: true },
  roomType: { type: String, trim: true },
  floor: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  pricePerNight: { type: Number, min: 0 },
  capacity: { type: Number, default: 2, min: 1 },
  bedType: String, view: String, amenities: { type: [String], default: [] },
  status: { type: String, enum: ['Available', 'Reserved', 'Occupied', 'Cleaning', 'Maintenance'], default: 'Available', index: true },
  housekeepingStatus: String, description: String, currentGuest: String, assignedAttendant: String, lastCleaned: String, notes: String,
}, { timestamps: true, toJSON: { virtuals: true, transform: (_doc, ret) => { delete ret.__v; return ret; } } });

roomSchema.pre('validate', function setRoomAliases(next) {
  this.roomType = this.roomType || this.type;
  this.type = this.type || this.roomType;
  this.pricePerNight = this.pricePerNight ?? this.price;
  this.price = this.price ?? this.pricePerNight;
  next();
});

export default mongoose.model('Room', roomSchema);