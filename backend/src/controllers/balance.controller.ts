import { Request, Response } from 'express';
import { getUSDCBalance, hasSufficientBalance, formatUSDC } from '../utils/spl-token';

export const getBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress } = req.params;

        if (!walletAddress) {
            res.status(400).json({ error: 'Wallet address required' });
            return;
        }

        const balance = await getUSDCBalance(walletAddress);

        res.json({
            success: true,
            walletAddress,
            balance,
            formatted: formatUSDC(balance),
            currency: 'USDC',
        });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
};

export const checkSufficientBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress } = req.params;
        const { amount } = req.query;

        if (!walletAddress || !amount) {
            res.status(400).json({ error: 'Wallet address and amount required' });
            return;
        }

        const requiredAmount = parseFloat(amount as string);
        const result = await hasSufficientBalance(walletAddress, requiredAmount);

        res.json({
            success: true,
            ...result,
            formattedBalance: formatUSDC(result.balance),
            formattedShortfall: result.shortfall > 0 ? formatUSDC(result.shortfall) : null,
        });
    } catch (error) {
        console.error('Error checking balance:', error);
        res.status(500).json({ error: 'Failed to check balance' });
    }
};
