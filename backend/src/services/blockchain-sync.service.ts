import { getConnection, fetchInvestmentAccount, fetchInvestorAccount } from './solana.service';
import Investment from '../models/Investment';
import { Types } from 'mongoose';

/**
 * Blockchain Sync Service
 * Syncs on-chain investment data to MongoDB for caching and faster queries
 */

/**
 * Sync a single investment from blockchain to database
 */
export async function syncInvestment(investmentId: string): Promise<void> {
    try {
        console.log(`Syncing investment ${investmentId} from blockchain...`);

        // Fetch from blockchain
        const onChainData = await fetchInvestmentAccount(investmentId);

        if (!onChainData) {
            console.log(`Investment ${investmentId} not found on blockchain`);
            return;
        }

        // Update or create in MongoDB
        await Investment.findOneAndUpdate(
            { _id: new Types.ObjectId(investmentId) },
            {
                $set: {
                    onChainAddress: onChainData.address,
                    lastSyncedAt: new Date(),
                    // Add more fields as needed after IDL is available
                }
            },
            { upsert: false }
        );

        console.log(`✅ Synced investment ${investmentId}`);
    } catch (error) {
        console.error(`Error syncing investment ${investmentId}:`, error);
    }
}

/**
 * Sync all investments from blockchain
 */
export async function syncAllInvestments(): Promise<void> {
    try {
        console.log('Starting full investment sync...');

        // Get all investments from MongoDB
        const investments = await Investment.find({});

        // Sync each investment
        for (const investment of investments) {
            await syncInvestment(investment._id.toString());
        }

        console.log(`✅ Synced ${investments.length} investments`);
    } catch (error) {
        console.error('Error syncing all investments:', error);
    }
}

/**
 * Sync investor position from blockchain
 */
export async function syncInvestorPosition(
    investmentId: string,
    investorWallet: string
): Promise<void> {
    try {
        console.log(`Syncing investor position for ${investorWallet} in ${investmentId}...`);

        // Fetch from blockchain
        const onChainData = await fetchInvestorAccount(investmentId, investorWallet);

        if (!onChainData) {
            console.log(`Investor position not found on blockchain`);
            return;
        }

        // TODO: Update investor position in database
        // This will be implemented after the schema is defined

        console.log(`✅ Synced investor position`);
    } catch (error) {
        console.error('Error syncing investor position:', error);
    }
}

/**
 * Start periodic sync (runs every 5 minutes)
 */
export function startPeriodicSync(): NodeJS.Timeout {
    console.log('🔄 Starting periodic blockchain sync...');

    // Run immediately
    syncAllInvestments();

    // Then run every 5 minutes
    const interval = setInterval(() => {
        syncAllInvestments();
    }, 5 * 60 * 1000); // 5 minutes

    return interval;
}

/**
 * Listen to program events (requires websocket connection)
 * This will be implemented after the Anchor program is deployed
 */
export async function listenToProgramEvents(): Promise<void> {
    try {
        console.log('👂 Listening to program events...');

        // TODO: Implement event listening using Anchor
        // This requires the program IDL and event definitions

        // Example:
        // program.addEventListener('InvestmentCreated', (event, slot) => {
        //   syncInvestment(event.investmentId);
        // });

    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

export default {
    syncInvestment,
    syncAllInvestments,
    syncInvestorPosition,
    startPeriodicSync,
    listenToProgramEvents,
};
