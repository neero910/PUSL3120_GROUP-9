import Room from '../models/Room.js';
import Guest from '../models/Guest.js';
import Reservation from '../models/Reservation.js';

const todayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { $gte: start, $lt: end };
};

export async function getDashboardSummary(req, res, next) {
  try {
    const today = todayRange();
    const [rooms, totalGuests, totalReservations, confirmed, pending, todayCheckIns, todayCheckOuts, revenue, recentReservations] = await Promise.all([
      Room.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Guest.countDocuments(), Reservation.countDocuments(),
      Reservation.countDocuments({ status: 'Confirmed' }), Reservation.countDocuments({ status: 'Pending' }),
      Reservation.find({ checkInDate: today, status: { $in: ['Confirmed', 'Checked In'] } }).populate('guest').populate('room'),
      Reservation.find({ checkOutDate: today, status: { $in: ['Confirmed', 'Checked In'] } }).populate('guest').populate('room'),
      Reservation.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Reservation.find().populate('guest').populate('room').sort({ createdAt: -1 }).limit(5),
    ]);
    const counts = Object.fromEntries(rooms.map((item) => [item._id, item.count]));
    const totalRooms = rooms.reduce((sum, item) => sum + item.count, 0);
    const mapReservation = (reservation) => ({
      id: reservation.reservationNumber || reservation._id,
      guest: reservation.guest?.fullName || `${reservation.guest?.firstName || ''} ${reservation.guest?.lastName || ''}`.trim() || 'Unknown guest',
      room: reservation.room?.roomNumber || 'N/A',
      checkIn: reservation.checkInDate?.toISOString().slice(0, 10) || '',
      checkOut: reservation.checkOutDate?.toISOString().slice(0, 10) || '',
      status: reservation.status || 'Pending',
    });
    return res.json({ success: true, data: {
      rooms: { total: totalRooms, available: counts.Available || 0, occupied: counts.Occupied || 0, reserved: counts.Reserved || 0, maintenance: counts.Maintenance || 0, occupancyRate: `${totalRooms ? ((counts.Occupied || 0) / totalRooms * 100).toFixed(2) : '0.00'}%` },
      guests: { total: totalGuests }, reservations: { total: totalReservations, confirmed, pending },
      revenue: { today: 0, total: revenue[0]?.total || 0 },
      today: { checkIns: todayCheckIns.length, checkOuts: todayCheckOuts.length },
      todayCheckIns: todayCheckIns.map(mapReservation), todayCheckOuts: todayCheckOuts.map(mapReservation),
      recentReservations: recentReservations.map(mapReservation),
    } });
  } catch (error) { return next(error); }
}

export async function getOccupancyData(req, res, next) {
  try { const data = await Room.aggregate([{ $group: { _id: '$type', total: { $sum: 1 }, occupied: { $sum: { $cond: [{ $eq: ['$status', 'Occupied'] }, 1, 0] } } } }]); return res.json({ success: true, data: data.map((item) => ({ type: item._id, total: item.total, occupied: item.occupied, available: item.total - item.occupied })) }); }
  catch (error) { return next(error); }
}

export async function getRevenueData(req, res, next) {
  try { const data = await Reservation.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' } } }, { $sort: { _id: 1 } }]); return res.json({ success: true, data: data.map((item) => ({ date: item._id, revenue: item.revenue })) }); }
  catch (error) { return next(error); }
}