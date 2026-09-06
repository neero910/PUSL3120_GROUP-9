import express from 'express';
import * as controller from '../controllers/stayController.js';
const router = express.Router();
router.get('/check-in/search', controller.searchCheckIn); router.get('/check-in/reservation/:id', controller.getCheckInReservation); router.post('/check-in/confirm', controller.confirmCheckIn);
router.get('/check-out/search', controller.searchCheckOut); router.get('/check-out/guest/:guestId', controller.getCheckOutGuest); router.post('/check-out/process', controller.processCheckOut);
export default router;