import mongoose from 'mongoose';
const { Schema } = mongoose;

// משווק שהצטרף לקמפיין - מקבל לינק אישי וקופון ייחודי
const referralSchema = new Schema(
  {
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    marketer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },

    slug: { type: String, required: true, unique: true, index: true },
    couponCode: { type: String, required: true, unique: true, uppercase: true, index: true },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paused'],
      default: 'approved',
      index: true,
    },

    stats: {
      clicks: { type: Number, default: 0 },
      uniqueClicks: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      earnings: { type: Number, default: 0 }, // סך עמלות מאושרות
      pending: { type: Number, default: 0 }, // עמלות ממתינות לאישור
    },

    lastClickAt: Date,
    lastSaleAt: Date,
  },
  { timestamps: true }
);

referralSchema.index({ campaign: 1, marketer: 1 }, { unique: true });

export const Referral = mongoose.model('Referral', referralSchema);
