import express from 'express';
import * as controller from '../controllers/commerceController.js';
const router = express.Router();
router.get('/menu-items', controller.getFoodItems); router.post('/menu-items', controller.createFoodItem); router.put('/menu-items/:id', controller.updateFoodItem); router.delete('/menu-items/:id', controller.deleteFoodItem);
router.get('/orders', controller.getFoodOrders); router.post('/orders', controller.createFoodOrder); router.put('/orders/:id', controller.updateFoodOrder);
router.get('/invoices', controller.getInvoices); router.get('/invoices/:id', controller.getInvoice); router.post('/invoices', controller.createInvoice);
router.get('/payments', controller.getPayments); router.get('/payments/:id', controller.getPayment); router.post('/payments', controller.createPayment); router.patch('/payments/:id', controller.updatePayment);
export default router;