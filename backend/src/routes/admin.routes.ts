import { Router } from 'express';
import { isAdmin } from '../middleware/admin.middleware';
import { getAdminStats, getPendingInvestments, approveInvestment, updateVettingStatus } from '../controllers/admin.controller';

const router = Router();

// Protect all admin routes
router.use(isAdmin);

router.get('/stats', getAdminStats);
router.get('/investments/pending', getPendingInvestments);
router.put('/investments/:id/approve', approveInvestment);
router.put('/investments/:id/vetting', updateVettingStatus);

export default router;
