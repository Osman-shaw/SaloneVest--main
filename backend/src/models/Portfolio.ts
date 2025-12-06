import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
    user: mongoose.Types.ObjectId;
    investment: mongoose.Types.ObjectId;
    principal: number;
    currentValue: number;
    accruedReturns: number;
    purchaseDate: Date;
    lastUpdated: Date;
}

const PortfolioSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    investment: { type: Schema.Types.ObjectId, ref: 'Investment', required: true },
    principal: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    accruedReturns: { type: Number, default: 0 },
    purchaseDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
});

PortfolioSchema.index({ user: 1 });
PortfolioSchema.index({ user: 1, investment: 1 });

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
