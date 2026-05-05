import mongoose from 'mongoose';
const { Schema } = mongoose;

const commissionSchema = new Schema(
  {
    referral: { type: Schema.Types.ObjectId, ref: 'Referral', required: true, index: true },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    marketer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    producer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },

    // Sale info
    couponCode: { type: String, uppercase: true },
    saleAmount: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 1 },
    externalOrderId: { type: String, index: true }, // מזהה הזמנה חיצוני
    saleSource: {
      type: String,
      enum: ['coupon-redemption', 'producer-report', 'manual', 'api-webhook'],
      default: 'coupon-redemption',
    },

    // Commission calc
    commissionType: { type: String, enum: ['percent', 'fixed'] },
    commissionValue: Number,
    commissionAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'ILS' },

    // Lifecycle
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid', 'reversed'],
      default: 'pending',
      index: true,
    },
    holdUntil: Date, // תאריך שאחריו מתאשר אוטומטית
    approvedAt: Date,
    paidAt: Date,
    payoutRequest: { type: Schema.Types.ObjectId, ref: 'PayoutRequest', index: true },
    rejectionReason: String,
  },
  { timestamps: true }
);

commissionSchema.index({ marketer: 1, status: 1 });
commissionSchema.index({ producer: 1, status: 1 });

export const Commission = mongoose.model('Commission', commissionSchema);
