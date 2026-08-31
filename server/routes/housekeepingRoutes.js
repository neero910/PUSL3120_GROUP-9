/**
 * Housekeeping Routes
 * Endpoints for Tasks, Staff, Maintenance, and Inventory
 */

import express from 'express';
import {
  // Tasks
  getTasks,
  getTaskById,
  createTask,
  updateTaskData,
  updateTaskStage,
  updateTaskChecklist,
  assignTaskStaff,
  deleteTaskData,
  getHousekeepingStats,
  // Staff
  getStaff,
  getStaffById,
  createStaff,
  updateStaffData,
  deleteStaffData,
  // Maintenance
  getMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenanceData,
  resolveMaintenance,
  deleteMaintenanceData,
  // Inventory
  getInventory,
  getInventoryById,
  createInventory,
  updateInventoryData,
  restockInventoryItem,
  deleteInventoryData
} from '../controllers/housekeepingController.js';

const router = express.Router();

// --- Summary Stats ---
router.get('/stats/summary', getHousekeepingStats);

// --- Task Routes ---
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTaskById);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTaskData);
router.patch('/tasks/:id', updateTaskData);
router.patch('/tasks/:id/stage', updateTaskStage);
router.patch('/tasks/:id/checklist', updateTaskChecklist);
router.patch('/tasks/:id/assign', assignTaskStaff);
router.delete('/tasks/:id', deleteTaskData);

// --- Staff Roster Routes ---
router.get('/staff', getStaff);
router.get('/staff/:id', getStaffById);
router.post('/staff', createStaff);
router.put('/staff/:id', updateStaffData);
router.patch('/staff/:id', updateStaffData);
router.delete('/staff/:id', deleteStaffData);

// --- Maintenance Routes ---
router.get('/maintenance', getMaintenance);
router.get('/maintenance/:id', getMaintenanceById);
router.post('/maintenance', createMaintenance);
router.put('/maintenance/:id', updateMaintenanceData);
router.patch('/maintenance/:id', updateMaintenanceData);
router.patch('/maintenance/:id/resolve', resolveMaintenance);
router.delete('/maintenance/:id', deleteMaintenanceData);

// --- Supply Inventory Routes ---
router.get('/inventory', getInventory);
router.get('/inventory/:id', getInventoryById);
router.post('/inventory', createInventory);
router.put('/inventory/:id', updateInventoryData);
router.patch('/inventory/:id', updateInventoryData);
router.post('/inventory/:id/restock', restockInventoryItem);
router.patch('/inventory/:id/restock', restockInventoryItem);
router.delete('/inventory/:id', deleteInventoryData);

export default router;
