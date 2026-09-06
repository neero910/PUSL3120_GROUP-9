import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Guest from '../models/Guest.js';
import Reservation from '../models/Reservation.js';
import Stay from '../models/Stay.js';
import FoodItem from '../models/FoodItem.js';
import FoodOrder from '../models/FoodOrder.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import HousekeepingTask from '../models/HousekeepingTask.js';
import HousekeepingStaff from '../models/HousekeepingStaff.js';
import MaintenanceIssue from '../models/MaintenanceIssue.js';
import InventorySupply from '../models/InventorySupply.js';

dotenv.config();

const users = [
  ['Admin User', 'admin@hotel.com', 'Administrator'],
  ['Manager User', 'manager@hotel.com', 'Manager'],
  ['Receptionist User', 'receptionist@hotel.com', 'Receptionist'],
  ['Restaurant Staff', 'restaurant@hotel.com', 'Restaurant Staff'],
].map(([name, email, role]) => ({ name, email, role, password: 'password123' }));

const rooms = [
  { roomNumber: '101', type: 'Standard', floor: 1, price: 10000, capacity: 2, status: 'Available', amenities: ['Free WiFi', 'Air Conditioning'] },
  { roomNumber: '201', type: 'Deluxe', floor: 2, price: 15000, capacity: 2, status: 'Available', amenities: ['Free WiFi', 'Balcony'] },
  { roomNumber: '301', type: 'Suite', floor: 3, price: 25000, capacity: 4, status: 'Available', amenities: ['Free WiFi', 'Living room'] },
  { roomNumber: '401', type: 'Deluxe', floor: 4, price: 18000, capacity: 2, status: 'Cleaning', amenities: ['Free WiFi', 'Pool view'] },
  { roomNumber: '501', type: 'Suite', floor: 5, price: 30000, capacity: 4, status: 'Maintenance', amenities: ['Free WiFi', 'Ocean view'] },
];

const guests = [
  { firstName: 'Kasun', lastName: 'Perera', email: 'kasun@example.com', phone: '0712345678', nationality: 'Sri Lankan', nicPassport: 'NIC123456789' },
  { firstName: 'Maya', lastName: 'Wickramasinghe', email: 'maya@example.com', phone: '0723456789', nationality: 'Sri Lankan', nicPassport: 'NIC987654321' },
  { firstName: 'Aisha', lastName: 'Rahman', email: 'aisha@example.com', phone: '0773456789', nationality: 'Maldivian', nicPassport: 'P1234567' },
];

const foodItems = [
  { itemNumber: 'MI-101', name: 'Classic Breakfast', category: 'Breakfast', price: 1400, description: 'Eggs, toast, fruit and tea' },
  { itemNumber: 'MI-201', name: 'Grilled Chicken Bowl', category: 'Main Course', price: 2600, description: 'Grilled chicken, rice and vegetables' },
  { itemNumber: 'MI-301', name: 'Fresh Lime Soda', category: 'Beverages', price: 600, description: 'Fresh lime with soda' },
  { itemNumber: 'MI-401', name: 'Chocolate Lava Cake', category: 'Desserts', price: 1200, description: 'Warm chocolate cake with vanilla ice cream' },
];

const staff = [
  { name: 'Kamani Silva', role: 'Senior Housekeeper', shift: 'Morning (07:00 - 15:30)', floor: 'Floor 1 & 2', assignedRooms: ['101', '201'], completedToday: 5, avatar: 'KS', phone: '+94 77 234 5671' },
  { name: 'Roshan Bandara', role: 'Housekeeping Attendant', shift: 'Morning (07:00 - 15:30)', floor: 'Floor 3 & 4', assignedRooms: ['301', '401'], completedToday: 4, avatar: 'RB', phone: '+94 71 889 1234' },
];
const tasks = [
  { roomNumber: '401', roomType: 'Deluxe', floor: 4, taskType: 'Checkout Turnover', priority: 'High', stage: 'In Progress', assignedTo: 'Roshan Bandara', dueTime: '14:00', startedAt: '12:30', notes: 'Prepare room for afternoon arrival.' },
  { roomNumber: '101', roomType: 'Standard', floor: 1, taskType: 'Routine Clean', priority: 'Normal', stage: 'Clean & Ready', assignedTo: 'Kamani Silva', dueTime: '11:00', startedAt: '10:00', notes: 'Inspected and certified ready.' },
];
const maintenance = [
  { roomNumber: '501', category: 'HVAC', title: 'Air conditioning unit requires service', severity: 'High', reportedBy: 'Kamani Silva', reportedAt: 'Today', assignedTechnician: 'Nuwan Kumara', status: 'In Progress', notes: 'Replacement part requested.' },
  { roomNumber: '401', category: 'Plumbing', title: 'Bathroom tap leaking', severity: 'Normal', reportedBy: 'Roshan Bandara', reportedAt: 'Today', assignedTechnician: 'Nuwan Kumara', status: 'Open', notes: 'Inspect before next arrival.' },
];
const inventory = [
  { item: 'Egyptian Cotton Bed Sheets', category: 'Linen', inStock: 64, minRequired: 40, unit: 'Sets' },
  { item: 'Luxury Bath Towels', category: 'Towels', inStock: 32, minRequired: 50, unit: 'Pcs' },
  { item: 'Guest Slippers', category: 'Amenities', inStock: 110, minRequired: 70, unit: 'Pairs' },
];

async function upsertBy(filter, Model, data) {
  return Model.findOneAndUpdate(filter, data, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true });
}

async function seed() {
  await connectDatabase();
  const seededUsers = {};
  for (const user of users) {
    seededUsers[user.email] = await upsertBy({ email: user.email }, User, { ...user, password: await bcrypt.hash(user.password, 10) });
  }

  const seededRooms = {};
  for (const room of rooms) seededRooms[room.roomNumber] = await upsertBy({ roomNumber: room.roomNumber }, Room, room);
  const seededGuests = {};
  for (const guest of guests) seededGuests[guest.email] = await upsertBy({ email: guest.email }, Guest, guest);
  const admin = seededUsers['admin@hotel.com'];
  const receptionist = seededUsers['receptionist@hotel.com'];

  const confirmedReservation = await upsertBy({ reservationNumber: 'RES-SEED-001' }, Reservation, {
    reservationNumber: 'RES-SEED-001', guest: seededGuests['kasun@example.com']._id, room: seededRooms['201']._id,
    checkInDate: new Date('2026-09-10'), checkOutDate: new Date('2026-09-13'), adults: 2, children: 0,
    status: 'Confirmed', totalAmount: 45000, specialRequests: 'Late arrival', createdBy: receptionist._id,
  });
  const checkedInReservation = await upsertBy({ reservationNumber: 'RES-SEED-002' }, Reservation, {
    reservationNumber: 'RES-SEED-002', guest: seededGuests['maya@example.com']._id, room: seededRooms['301']._id,
    checkInDate: new Date('2026-09-05'), checkOutDate: new Date('2026-09-08'), adults: 2, children: 1,
    status: 'Checked In', totalAmount: 75000, specialRequests: 'Extra bed', createdBy: admin._id,
  });
  await upsertBy({ reservationNumber: 'RES-SEED-003' }, Reservation, {
    reservationNumber: 'RES-SEED-003', guest: seededGuests['aisha@example.com']._id, room: seededRooms['101']._id,
    checkInDate: new Date('2026-09-20'), checkOutDate: new Date('2026-09-22'), adults: 1, children: 0,
    status: 'Confirmed', totalAmount: 20000, createdBy: receptionist._id,
  });

  const stay = await upsertBy({ reservation: checkedInReservation._id }, Stay, {
    reservation: checkedInReservation._id, guest: checkedInReservation.guest, room: checkedInReservation.room,
    actualCheckIn: new Date('2026-09-05T12:00:00Z'), expectedCheckOut: checkedInReservation.checkOutDate,
    status: 'Active', checkedInBy: receptionist._id,
  });

  const seededFoodItems = {};
  for (const item of foodItems) seededFoodItems[item.itemNumber] = await upsertBy({ itemNumber: item.itemNumber }, FoodItem, item);
  const breakfast = seededFoodItems['MI-101'];
  const drink = seededFoodItems['MI-301'];
  const orderItems = [{ foodItem: breakfast._id, quantity: 2, price: breakfast.price, subtotal: breakfast.price * 2 }, { foodItem: drink._id, quantity: 1, price: drink.price, subtotal: drink.price }];
  const order = await upsertBy({ orderNumber: 'ORD-SEED-001' }, FoodOrder, { orderNumber: 'ORD-SEED-001', guest: checkedInReservation.guest, room: '301', items: orderItems, totalAmount: 3400, status: 'Completed', createdBy: seededUsers['restaurant@hotel.com']._id });

  const invoice = await upsertBy({ invoiceNumber: 'INV-SEED-001' }, Invoice, { invoiceNumber: 'INV-SEED-001', guest: checkedInReservation.guest, reservation: checkedInReservation._id, stay: stay._id, roomCharges: 75000, foodCharges: order.totalAmount, additionalCharges: 0, discount: 0, totalAmount: 78400, amountPaid: 50000, paymentStatus: 'Partially Paid' });
  await upsertBy({ paymentNumber: 'PAY-SEED-001' }, Payment, { paymentNumber: 'PAY-SEED-001', invoice: invoice._id, guest: invoice.guest, amount: 50000, paymentMethod: 'Card', status: 'Completed', processedBy: receptionist._id });

  for (const member of staff) await upsertBy({ name: member.name }, HousekeepingStaff, member);
  for (const task of tasks) await upsertBy({ roomNumber: task.roomNumber, taskType: task.taskType }, HousekeepingTask, { ...task, checklist: [{ id: 'c1', label: 'Clean and inspect room', completed: task.stage === 'Clean & Ready' }, { id: 'c2', label: 'Restock guest supplies', completed: false }] });
  for (const issue of maintenance) await upsertBy({ roomNumber: issue.roomNumber, title: issue.title }, MaintenanceIssue, issue);
  for (const item of inventory) await upsertBy({ item: item.item }, InventorySupply, item);

  console.log('Development seed complete for all modules. Login password: password123');
  console.log('Seeded: users, rooms, guests, reservations, stays, food items, orders, invoices, payments, housekeeping, maintenance, inventory.');
}

try {
  await seed();
} finally {
  await disconnectDatabase();
}
