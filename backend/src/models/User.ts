import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    walletAddress: string;
    createdAt: Date;
    lastLogin: Date;
    role: 'investor' | 'admin';
    profile?: {
        name?: string;
        email?: string;
        avatar?: string;
    };
    settings?: {
        notifications: boolean;
        currency: string;
        riskTolerance?: 'low' | 'moderate' | 'high';
    };
}

const UserSchema: Schema = new Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    role: { type: String, enum: ['investor', 'admin'], default: 'investor' },
    profile: {
        name: String,
        email: String,
        avatar: String,
    },
    settings: {
        notifications: { type: Boolean, default: true },
        currency: { type: String, default: 'USDC' },
        riskTolerance: { type: String, enum: ['low', 'moderate', 'high'] },
    },
});

export default mongoose.model<IUser>('User', UserSchema);
