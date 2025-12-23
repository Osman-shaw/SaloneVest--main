import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    investment: mongoose.Types.ObjectId;
    amount: number;
    txHash: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: Date;
    fee: number;
    network: string;
}

const TransactionSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    investment: { type: Schema.Types.ObjectId, ref: 'Investment', required: true },
    amount: { type: Number, required: true },
    txHash: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending'
    },
    timestamp: { type: Date, default: Date.now },
    fee: { type: Number, default: 0 },
    network: { type: String, default: 'solana' },
});

TransactionSchema.index({ user: 1, timestamp: -1 });
TransactionSchema.index({ txHash: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
