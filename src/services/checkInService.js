import { apiCall } from './api';

/**
 * Search for a reservation by ID or guest name
 * @param {string} searchQuery - Reservation ID or guest name
 * @returns {Promise<Object>} Reservation details
 */
export const searchReservation = async (searchQuery) => {
  try {
    const response = await apiCall(`/check-in/search?query=${encodeURIComponent(searchQuery)}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to search reservation: ${error.message}`);
  }
};

/**
 * Get reservation details by reservation ID
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<Object>} Full reservation details
 */
export const getReservationDetails = async (reservationId) => {
  try {
    const response = await apiCall(`/check-in/reservation/${reservationId}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch reservation details: ${error.message}`);
  }
};

/**
 * Get guest information for check-in
 * @param {string} guestId - Guest ID
 * @returns {Promise<Object>} Guest information
 */
export const getGuestInfo = async (guestId) => {
  try {
    const response = await apiCall(`/check-in/guest/${guestId}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch guest information: ${error.message}`);
  }
};

/**
 * Get room details for check-in
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} Room information
 */
export const getRoomInfo = async (roomId) => {
  try {
    const response = await apiCall(`/check-in/room/${roomId}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch room information: ${error.message}`);
  }
};

/**
 * Confirm check-in for a guest
 * @param {Object} checkInData - Check-in data
 * @param {string} checkInData.reservationId - Reservation ID
 * @param {string} checkInData.guestId - Guest ID
 * @param {string} checkInData.roomId - Room ID
 * @param {string} checkInData.checkInTime - Check-in timestamp
 * @param {Object} checkInData.notes - Additional notes
 * @returns {Promise<Object>} Check-in confirmation
 */
export const confirmCheckIn = async (checkInData) => {
  try {
    const response = await apiCall('/check-in/confirm', {
      method: 'POST',
      body: checkInData,
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to confirm check-in: ${error.message}`);
  }
};

/**
 * Get pending check-ins
 * @returns {Promise<Array>} List of pending check-ins
 */
export const getPendingCheckIns = async () => {
  try {
    const response = await apiCall('/check-in/pending');
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch pending check-ins: ${error.message}`);
  }
};

/**
 * Update check-in status
 * @param {string} checkInId - Check-in ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated check-in data
 */
export const updateCheckInStatus = async (checkInId, updateData) => {
  try {
    const response = await apiCall(`/check-in/${checkInId}`, {
      method: 'PUT',
      body: updateData,
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to update check-in status: ${error.message}`);
  }
};
