import { Router } from 'express';
import {
    getUserPortfolio,
    getPortfolioPerformance,
    getTransactionHistory
} from '../controllers/portfolio.controller';

const router = Router();

router.get('/:walletAddress', getUserPortfolio);
router.get('/:walletAddress/performance', getPortfolioPerformance);
router.get('/:walletAddress/transactions', getTransactionHistory);

export default router;
