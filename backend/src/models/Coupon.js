import mongoose from 'mongoose';
const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    referral: { type: Schema.Types.ObjectId, ref: 'Referral', required: true, index: true },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    marketer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    discountValue: { type: Number, default: 0 },

    maxUses: Number, // null = ללא הגבלה
    usedCount: { type: Number, default: 0 },

    expiresAt: Date,

    status: { type: String, enum: ['active', 'expired', 'disabled'], default: 'active', index: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model('Coupon', couponSchema);
