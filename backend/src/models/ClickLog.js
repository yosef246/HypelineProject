import mongoose from 'mongoose';
const { Schema } = mongoose;

const clickLogSchema = new Schema(
  {
    referral: { type: Schema.Types.ObjectId, ref: 'Referral', required: true, index: true },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    marketer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    ipHash: String, // hashed IP for privacy
    userAgent: String,
    device: String, // mobile / tablet / desktop
    browser: String,
    os: String,
    referrerHost: String, // facebook.com / instagram.com / whatsapp / direct

    // Anti-fraud
    dedupKey: { type: String, index: true }, // ipHash + referralId + day → manage uniqueClicks
    isUnique: { type: Boolean, default: true },
    suspicious: { type: Boolean, default: false },

    country: String,
  },
  { timestamps: true }
);

clickLogSchema.index({ createdAt: -1 });
// TTL - לוגים נמחקים אחרי 180 יום
clickLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

export const ClickLog = mongoose.model('ClickLog', clickLogSchema);
