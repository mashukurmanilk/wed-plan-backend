import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
  updateServiceStatus,
} from '../controllers/services.controller.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', createService);
router.patch('/:id/toggle-active', toggleServiceActive);
router.patch('/:id/status', updateServiceStatus);
router.put('/:id', updateService);
router.patch('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
