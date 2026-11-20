import express from 'express';
import {
  getAllUsers,
  getUserById,
  createOrUpdateUser,
  updateProfile,
  toggleUserBlock,
  seedDatabase,
} from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/seed', seedDatabase);
router.get('/:id', getUserById);
router.post('/', createOrUpdateUser);
router.patch('/:id', updateProfile);
router.patch('/:id/block', toggleUserBlock);

export default router;
