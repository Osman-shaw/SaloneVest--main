import { Router } from 'express';
import { getBalance, checkSufficientBalance } from '../controllers/balance.controller';

const router = Router();

router.get('/:walletAddress', getBalance);
router.get('/:walletAddress/check', checkSufficientBalance);

export default router;
