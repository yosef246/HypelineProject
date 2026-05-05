import mongoose from 'mongoose';
const { Schema } = mongoose;

const payoutRequestSchema = new Schema(
  {
    marketer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'ILS' },

    commissions: [{ type: Schema.Types.ObjectId, ref: 'Commission' }],

    // Bank snapshot at request time (history protection)
    bankSnapshot: {
      accountHolder: String,
      bankCode: String,
      branchCode: String,
      accountNumber: String,
      idNumber: String,
    },

    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'rejected', 'failed'],
      default: 'pending',
      index: true,
    },

    // מס"ב (Masav) batch
    masavBatchId: String,
    masavExportedAt: Date,

    paidAt: Date,
    rejectionReason: String,
    notes: String,
  },
  { timestamps: true }
);

export const PayoutRequest = mongoose.model('PayoutRequest', payoutRequestSchema);
