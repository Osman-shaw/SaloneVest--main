import { Router } from 'express';
import { getUserProfile, updateUserProfile, getAllUsers } from '../controllers/user.controller';

const router = Router();
router.get('/', getAllUsers);
router.get('/:walletAddress', getUserProfile);
router.put('/:walletAddress', updateUserProfile);

export default router;
