/**
 * Dashboard Controller
 * Provides summary statistics for the dashboard
 */

import { rooms } from '../data/rooms.js';
import { guests } from '../data/guests.js';
import { reservations } from '../data/reservations.js';

/**
 * Get dashboard summary
 * GET /api/dashboard/summary
 */
export function getDashboardSummary(req, res, next) {
  try {
    // Room statistics
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'Available').length;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;
    const reservedRooms = totalRooms - availableRooms - occupiedRooms - maintenanceRooms;
    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : 0;

    // Guest statistics
    const totalGuests = guests.length;
    const activeGuests = guests.filter(g => g.status === 'Active').length;

    // Reservation statistics
    const totalReservations = reservations.length;
    const confirmedReservations = reservations.filter(r => r.status === 'Confirmed').length;
    const pendingReservations = reservations.filter(r => r.status === 'Pending').length;

    // Revenue
    const todayRevenue = reservations
      .filter(r => {
        const today = new Date().toISOString().split('T')[0];
        return r.checkInDate === today && r.status !== 'Cancelled';
      })
      .reduce((sum, r) => sum + r.totalAmount, 0);

    const totalRevenue = reservations
      .filter(r => r.status !== 'Cancelled')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    // Check-ins and check-outs today
    const today = new Date().toISOString().split('T')[0];
    const todayCheckIns = reservations.filter(r => r.checkInDate === today && r.status === 'Confirmed');
    const todayCheckOuts = reservations.filter(r => r.checkOutDate === today && r.status === 'Confirmed');

    // Recent reservations
    const recentReservations = reservations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(r => {
        const guest = guests.find(g => g.id === r.guestId);
        const room = rooms.find(room => room.id === r.roomId);
        return {
          id: r.id,
          guestName: guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown',
          roomNumber: room ? room.roomNumber : 'N/A',
          checkInDate: r.checkInDate,
          checkOutDate: r.checkOutDate,
          status: r.status,
          totalAmount: r.totalAmount
        };
      });

    res.json({
      success: true,
      data: {
        rooms: {
          total: totalRooms,
          available: availableRooms,
          occupied: occupiedRooms,
          reserved: reservedRooms,
          maintenance: maintenanceRooms,
          occupancyRate: `${occupancyRate}%`
        },
        guests: {
          total: totalGuests,
          active: activeGuests
        },
        reservations: {
          total: totalReservations,
          confirmed: confirmedReservations,
          pending: pendingReservations
        },
        revenue: {
          today: todayRevenue,
          total: totalRevenue
        },
        today: {
          checkIns: todayCheckIns.length,
          checkOuts: todayCheckOuts.length
        },
        recentReservations
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    next(error);
  }
}

/**
 * Get room occupancy data
 * GET /api/dashboard/occupancy
 */
export function getOccupancyData(req, res, next) {
  try {
    const roomTypes = [...new Set(rooms.map(r => r.type))];
    
    const occupancyByType = roomTypes.map(type => {
      const typeRooms = rooms.filter(r => r.type === type);
      const occupied = typeRooms.filter(r => r.status === 'Occupied').length;
      
      return {
        type,
        total: typeRooms.length,
        occupied,
        available: typeRooms.length - occupied,
        occupancyRate: typeRooms.length > 0 ? ((occupied / typeRooms.length) * 100).toFixed(2) : 0
      };
    });

    res.json({
      success: true,
      data: occupancyByType
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get revenue data
 * GET /api/dashboard/revenue
 */
export function getRevenueData(req, res, next) {
  try {
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = reservations
        .filter(r => r.checkInDate === dateStr && r.status !== 'Cancelled')
        .reduce((sum, r) => sum + r.totalAmount, 0);

      last7Days.push({
        date: dateStr,
        revenue: dayRevenue
      });
    }

    res.json({
      success: true,
      data: last7Days
    });
  } catch (error) {
    next(error);
  }
}
