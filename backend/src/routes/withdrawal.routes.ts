import { Router } from 'express';
import {
    createWithdrawal,
    getUserWithdrawals,
    getAllWithdrawals,
    approveWithdrawal,
    processWithdrawal,
    cancelWithdrawal,
    getWithdrawalStats
} from '../controllers/withdrawal.controller';

const router = Router();

// User routes
router.post('/', createWithdrawal);
router.get('/user/:userId', getUserWithdrawals);
router.put('/:id/cancel', cancelWithdrawal);

// Admin routes
router.get('/', getAllWithdrawals);
router.get('/stats/summary', getWithdrawalStats);
router.put('/:id/approve', approveWithdrawal);
router.put('/:id/process', processWithdrawal);

export default router;
