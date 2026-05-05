import mongoose from 'mongoose';
const { Schema } = mongoose;

const campaignSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    producer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    name: { type: String, required: true, maxlength: 200 },
    description: String,

    // Commission settings
    commissionType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    commissionValue: { type: Number, required: true, min: 0 }, // אחוז (0-100) או סכום
    discountPercent: { type: Number, default: 0, min: 0, max: 100 }, // הנחה ללקוח דרך הקופון

    // Time window
    startsAt: { type: Date, default: Date.now },
    endsAt: Date,

    // Limits
    maxMarketers: Number, // null = ללא הגבלה
    requireApproval: { type: Boolean, default: false }, // המפיק צריך לאשר משווקים

    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'ended'],
      default: 'active',
      index: true,
    },

    // Counters (denormalized for speed)
    stats: {
      marketers: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      commissionsPaid: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

campaignSchema.index({ producer: 1, status: 1 });

export const Campaign = mongoose.model('Campaign', campaignSchema);
