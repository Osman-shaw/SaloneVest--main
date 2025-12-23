import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller';

const router = Router();

router.get('/:walletAddress', getUserProfile);
router.put('/:walletAddress', updateUserProfile);

export default router;
