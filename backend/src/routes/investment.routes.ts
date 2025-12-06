import { Router } from 'express';
import {
    getAllInvestments,
    getInvestmentById,
    createInvestmentTransaction
} from '../controllers/investment.controller';

const router = Router();

router.get('/', getAllInvestments);
router.get('/:id', getInvestmentById);
router.post('/transaction', createInvestmentTransaction);

export default router;
