import mongoose from 'mongoose';
export default mongoose.model('FoodItem', new mongoose.Schema({
  itemNumber: { type: String, unique: true }, name: { type: String, required: true }, category: { type: String, required: true }, price: { type: Number, required: true, min: 0 }, description: String, availability: { type: Boolean, default: true },
}, { timestamps: true }));