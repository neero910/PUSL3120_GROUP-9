import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import housekeepingRoutes from './routes/housekeepingRoutes.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const menuItems = [
  { id: 'MI-101', name: 'Classic Breakfast', category: 'Breakfast', price: 'LKR 1400' },
  { id: 'MI-102', name: 'Eggs Benedict', category: 'Breakfast', price: 'LKR 1850' },
  { id: 'MI-201', name: 'Grilled Chicken Bowl', category: 'Main Course', price: 'LKR 2600' },
  { id: 'MI-202', name: 'Seafood Pasta', category: 'Main Course', price: 'LKR 3100' },
  { id: 'MI-301', name: 'Fresh Lime Soda', category: 'Beverages', price: 'LKR 600' },
  { id: 'MI-302', name: 'Mango Smoothie', category: 'Beverages', price: 'LKR 850' },
  { id: 'MI-401', name: 'Chocolate Lava Cake', category: 'Desserts', price: 'LKR 1200' },
];

const orders = [];

const payments = [
  { id: 'PAY-9012', guest: 'Nimal Perera', invoice: 'INV-3041', amount: 'LKR 22,500', method: 'Card', date: '2026-08-20', status: 'Paid' },
  { id: 'PAY-9013', guest: 'Aisha Rahman', invoice: 'INV-3042', amount: 'LKR 35,000', method: 'Cash', date: '2026-08-20', status: 'Pending' },
  { id: 'PAY-9014', guest: 'Maya Wickramasinghe', invoice: 'INV-3043', amount: 'LKR 12,200', method: 'Bank Transfer', date: '2026-08-19', status: 'Paid' },
];

const invoices = [
  { id: 'INV-3041', guest: 'Nimal Perera', room: '201', amount: 'LKR 22,500', issuedDate: '2026-08-20', paymentStatus: 'Paid' },
  { id: 'INV-3042', guest: 'Aisha Rahman', room: '305', amount: 'LKR 35,000', issuedDate: '2026-08-20', paymentStatus: 'Pending' },
  { id: 'INV-3043', guest: 'Maya Wickramasinghe', room: '210', amount: 'LKR 12,200', issuedDate: '2026-08-19', paymentStatus: 'Paid' },
];

const checkIns = [
  {
    id: 'CHK-1001',
    reservationId: 'RES001',
    guestId: 'G001',
    roomId: '103',
    guestName: 'Kasun Perera',
    guestContact: '0712345678',
    guestEmail: 'kasun.perera@email.com',
    passportNumber: 'NIC123456789',
    roomNumber: '103',
    roomType: 'Deluxe',
    roomRate: 'LKR 15,000',
    floor: 1,
    checkInDate: '2026-08-30',
    checkOutDate: '2026-09-02',
    numberOfGuests: 2,
    totalAmount: 'LKR 45,000',
    status: 'Checked In',
    specialRequests: 'Early check-in preferred',
    checkedInAt: '2026-08-30T12:00:00Z',
  },
];

const checkOuts = [
  {
    guestId: 'G001',
    reservationId: 'RES001',
    guestName: 'Kasun Perera',
    roomNumber: '103',
    checkInDate: '2026-08-30',
    numberOfNights: 3,
    roomCharges: 'LKR 45,000',
    restaurantCharges: 'LKR 0',
    additionalCharges: 'LKR 0',
    subtotal: 'LKR 45,000',
    discount: 'LKR 0',
    totalCharges: 'LKR 45,000',
  },
];

// Middleware
app.use(express.json());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hotel Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/menu-items', (req, res) => {
  res.json({ success: true, data: menuItems });
});

app.post('/api/orders', (req, res) => {
  const { room, note, items, total } = req.body;

  if (!room || !Array.isArray(items) || !items.length) {
    return res.status(400).json({
      success: false,
      message: 'Room and at least one menu item are required'
    });
  }

  const order = {
    id: `ORD-${Date.now()}`,
    room,
    note: note || '',
    items,
    total: Number(total) || 0,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order
  });
});

app.get('/api/payments', (req, res) => {
  res.json({ success: true, data: payments });
});

app.patch('/api/payments/:id', (req, res) => {
  const { id } = req.params;
  const payment = payments.find((entry) => entry.id === id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }

  payment.status = req.body?.status || payment.status;

  return res.json({
    success: true,
    message: 'Payment updated successfully',
    data: payment
  });
});

app.get('/api/invoices', (req, res) => {
  res.json({ success: true, data: invoices });
});

app.get('/api/check-in/search', (req, res) => {
  const { query } = req.query;
  const reservation = globalThis.__hotelReservationStore?.find((entry) => entry.id === query || `${entry.guestName || ''}`.toLowerCase().includes((query || '').toLowerCase()))
    || { id: 'RES001', guestName: 'Kasun Perera' };

  return res.json({
    success: true,
    id: reservation.id,
    guestName: reservation.guestName,
  });
});

app.get('/api/check-in/reservation/:id', (req, res) => {
  const reservation = globalThis.__hotelReservationStore?.find((entry) => entry.id === req.params.id)
    || {
      id: 'RES001',
      guestId: 'G001',
      roomId: '103',
      guestName: 'Kasun Perera',
      guestContact: '0712345678',
      guestEmail: 'kasun.perera@email.com',
      passportNumber: 'NIC123456789',
      roomNumber: '103',
      roomType: 'Deluxe',
      roomRate: 'LKR 15,000',
      floor: 1,
      checkInDate: '2026-08-30',
      checkOutDate: '2026-09-02',
      numberOfGuests: 2,
      totalAmount: 'LKR 45,000',
      status: 'Confirmed',
      specialRequests: 'Early check-in preferred',
    };

  return res.json({
    success: true,
    ...reservation,
  });
});

app.post('/api/check-in/confirm', (req, res) => {
  const { reservationId, guestId, roomId } = req.body;

  if (!reservationId || !guestId || !roomId) {
    return res.status(400).json({
      success: false,
      message: 'Reservation ID, guest ID, and room ID are required',
    });
  }

  const checkIn = {
    id: `CHK-${Date.now()}`,
    reservationId,
    guestId,
    roomId,
    checkedInAt: new Date().toISOString(),
    status: 'Checked In',
  };

  checkIns.push(checkIn);

  return res.json({
    success: true,
    message: 'Check-in confirmed successfully',
    data: checkIn,
  });
});

app.get('/api/check-out/search', (req, res) => {
  const { query } = req.query;
  const guest = checkOuts.find((entry) => {
    const matchKey = `${entry.guestName || ''} ${entry.roomNumber || ''}`.toLowerCase();
    return matchKey.includes((query || '').toLowerCase());
  }) || checkOuts[0];

  if (!guest) {
    return res.status(404).json({ success: false, message: 'Active guest not found' });
  }

  return res.json({
    success: true,
    guestId: guest.guestId,
    reservationId: guest.reservationId,
    guestName: guest.guestName,
    roomNumber: guest.roomNumber,
  });
});

app.get('/api/check-out/guest/:guestId', (req, res) => {
  const guest = checkOuts.find((entry) => entry.guestId === req.params.guestId) || checkOuts[0];

  return res.json({
    success: true,
    ...guest,
  });
});

app.post('/api/check-out/process', (req, res) => {
  const { guestId, reservationId, totalAmount, paymentMethod } = req.body;

  if (!guestId || !reservationId || !totalAmount) {
    return res.status(400).json({
      success: false,
      message: 'Guest ID, reservation ID, and total amount are required',
    });
  }

  return res.json({
    success: true,
    message: 'Check-out completed successfully',
    data: {
      guestId,
      reservationId,
      paymentMethod,
      totalAmount,
      status: 'Checked Out',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export function startServer() {
  return app.listen(PORT, () => {
    console.log(`🚀 Hotel Management API running on http://localhost:${PORT}`);
    console.log(`📡 CORS enabled for: ${CLIENT_URL}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  startServer();
}

export default app;
