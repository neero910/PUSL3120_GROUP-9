import { apiCall } from './api';

/**
 * Search for an active guest for check-out
 * @param {string} searchQuery - Guest name or room number
 * @returns {Promise<Object>} Guest check-out information
 */
export const searchActiveGuest = async (searchQuery) => {
  try {
    const response = await apiCall(`/check-out/search?query=${encodeURIComponent(searchQuery)}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to search active guest: ${error.message}`);
  }
};

/**
 * Get check-out details for a guest
 * @param {string} guestId - Guest ID
 * @returns {Promise<Object>} Full check-out information including charges
 */
export const getCheckOutDetails = async (guestId) => {
  try {
    const response = await apiCall(`/check-out/guest/${guestId}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch check-out details: ${error.message}`);
  }
};

/**
 * Get check-out details by reservation ID
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<Object>} Full check-out information
 */
export const getCheckOutDetailsByReservation = async (reservationId) => {
  try {
    const response = await apiCall(`/check-out/reservation/${reservationId}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch check-out details: ${error.message}`);
  }
};

/**
 * Get charges breakdown for a stay
 * @param {string} guestId - Guest ID
 * @returns {Promise<Object>} Charges breakdown (room, food, additional, discount)
 */
export const getChargesBreakdown = async (guestId) => {
  try {
    const response = await apiCall(`/check-out/charges/${guestId}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch charges breakdown: ${error.message}`);
  }
};

/**
 * Get available payment methods
 * @returns {Promise<Array>} List of available payment methods
 */
export const getPaymentMethods = async () => {
  try {
    const response = await apiCall('/check-out/payment-methods');
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch payment methods: ${error.message}`);
  }
};

/**
 * Process check-out and payment
 * @param {Object} checkOutData - Check-out data
 * @param {string} checkOutData.guestId - Guest ID
 * @param {string} checkOutData.reservationId - Reservation ID
 * @param {string} checkOutData.checkOutTime - Check-out timestamp
 * @param {string} checkOutData.paymentMethod - Payment method (Cash, Card, Bank Transfer, etc.)
 * @param {number} checkOutData.totalAmount - Total amount to be paid
 * @param {Object} checkOutData.paymentDetails - Payment-specific details
 * @param {Object} checkOutData.notes - Additional notes
 * @returns {Promise<Object>} Check-out confirmation and invoice details
 */
export const processCheckOut = async (checkOutData) => {
  try {
    const response = await apiCall('/check-out/process', {
      method: 'POST',
      body: checkOutData,
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to process check-out: ${error.message}`);
  }
};

/**
 * Apply discount to bill
 * @param {string} guestId - Guest ID
 * @param {Object} discountData - Discount details
 * @param {number} discountData.amount - Discount amount
 * @param {string} discountData.reason - Reason for discount
 * @param {string} discountData.approvedBy - Staff member approving discount
 * @returns {Promise<Object>} Updated charges with discount applied
 */
export const applyDiscount = async (guestId, discountData) => {
  try {
    const response = await apiCall(`/check-out/discount/${guestId}`, {
      method: 'POST',
      body: discountData,
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to apply discount: ${error.message}`);
  }
};

/**
 * Get pending check-outs
 * @returns {Promise<Array>} List of guests due for check-out
 */
export const getPendingCheckOuts = async () => {
  try {
    const response = await apiCall('/check-out/pending');
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch pending check-outs: ${error.message}`);
  }
};

/**
 * Generate invoice for check-out
 * @param {string} guestId - Guest ID
 * @returns {Promise<Object>} Invoice data
 */
export const generateInvoice = async (guestId) => {
  try {
    const response = await apiCall(`/check-out/invoice/${guestId}`);
    return response;
  } catch (error) {
    throw new Error(`Failed to generate invoice: ${error.message}`);
  }
};
