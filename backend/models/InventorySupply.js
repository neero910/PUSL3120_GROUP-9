import mongoose from 'mongoose';

const inventorySupplySchema = new mongoose.Schema({
  item: { type: String, required: true, trim: true },
  category: { type: String, default: 'General' },
  inStock: { type: Number, default: 0 },
  minRequired: { type: Number, default: 10 },
  unit: { type: String, default: 'Pcs' },
  status: { type: String, enum: ['In Stock', 'Low Stock', 'Reorder Needed'], default: 'In Stock' }
}, { timestamps: true });

// Pre-save hook to calculate status automatically if not explicitly set correctly based on inStock and minRequired
inventorySupplySchema.pre('save', function(next) {
  if (this.inStock >= this.minRequired) {
    this.status = 'In Stock';
  } else if (this.inStock > 0) {
    this.status = 'Low Stock';
  } else {
    this.status = 'Reorder Needed';
  }
  next();
});

export default mongoose.model('InventorySupply', inventorySupplySchema);
