import { Router } from 'express';
import { connectWallet } from '../controllers/auth.controller';

const router = Router();

router.post('/connect', connectWallet);

export default router;
