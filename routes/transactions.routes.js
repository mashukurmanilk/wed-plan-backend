import express from 'express';
import {
  getAllTransactions,
  createTransaction,
  upgradeToPremium,
} from '../controllers/transactions.controller.js';

const router = express.Router();

router.get('/', getAllTransactions);
router.post('/', createTransaction);
router.post('/upgrade', upgradeToPremium);

export default router;
