import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestment extends Document {
    name: string;
    description: string;
    type: 'startup' | 'bond' | 'fund';
    category: 'growth' | 'income' | 'impact';
    risk: 'low' | 'moderate' | 'high';
    expectedYield: number;
    minimumInvestment: number;
    totalRaised: number;
    targetAmount: number;
    status: 'active' | 'closed' | 'funded';
    createdAt: Date;
    updatedAt: Date;
    details?: {
        sector?: string;
        location?: string;
        duration?: string;
        verified?: boolean;
        vettingStages?: Array<{
            id: string;
            label: string;
            status: 'pending' | 'current' | 'completed';
            date?: Date;
        }>;
    };
}

const InvestmentSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['startup', 'bond', 'fund'], required: true },
    category: { type: String, enum: ['growth', 'income', 'impact'], required: true },
    risk: { type: String, enum: ['low', 'moderate', 'high'], required: true },
    expectedYield: { type: Number, required: true },
    minimumInvestment: { type: Number, required: true },
    totalRaised: { type: Number, default: 0 },
    targetAmount: { type: Number, required: true },
    status: { type: String, enum: ['active', 'closed', 'funded'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    details: {
        sector: String,
        location: String,
        duration: String,
        verified: { type: Boolean, default: false },
        vettingStages: [{
            id: String,
            label: String,
            status: { type: String, enum: ['pending', 'current', 'completed'], default: 'pending' },
            date: Date
        }]
    },
});

export default mongoose.model<IInvestment>('Investment', InvestmentSchema);
