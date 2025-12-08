import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawal extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    paymentMethod: 'bank_transfer' | 'orange_money' | 'afromo_money';
    status: 'pending' | 'approved' | 'processed' | 'failed' | 'cancelled';
    bankDetails?: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
        swiftCode?: string;
        routingNumber?: string;
    };
    mobileMoneyDetails?: {
        phoneNumber: string;
        providerName: string;
        accountName: string;
    };
    transactionReference?: string;
    fee: number;
    netAmount: number;
    reason?: string;
    approvedBy?: mongoose.Types.ObjectId;
    processedDate?: Date;
    failureReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const WithdrawalSchema: Schema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: 10 // Minimum withdrawal amount
    },
    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'orange_money', 'afromo_money'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'processed', 'failed', 'cancelled'],
        default: 'pending'
    },
    
    // Bank transfer details
    bankDetails: {
        bankName: String,
        accountNumber: String,
        accountHolder: String,
        swiftCode: String,
        routingNumber: String
    },
    
    // Mobile money details (Orange Money, Afromo Money)
    mobileMoneyDetails: {
        phoneNumber: String,
        providerName: String, // 'Orange Money', 'Afromo Money'
        accountName: String
    },
    
    transactionReference: String,
    
    // Fees and calculations
    fee: { 
        type: Number, 
        default: 0 
    },
    netAmount: { 
        type: Number, 
        required: true 
    },
    
    reason: String,
    approvedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    processedDate: Date,
    failureReason: String,
    
}, { 
    timestamps: true 
});

// Index for efficient queries
WithdrawalSchema.index({ user: 1, createdAt: -1 });
WithdrawalSchema.index({ status: 1 });
WithdrawalSchema.index({ paymentMethod: 1 });

// Calculate net amount before saving
WithdrawalSchema.pre('save', function(next: any) {
    const doc = this as any;
    if (doc.isModified('amount') || doc.isModified('fee')) {
        doc.netAmount = doc.amount - doc.fee;
    }
    next();
});

export default mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);
