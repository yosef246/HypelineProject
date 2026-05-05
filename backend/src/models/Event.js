import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    producer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, sparse: true, index: true },
    description: { type: String, maxlength: 5000 },
    coverImage: String,

    // External integration
    externalPlatform: { type: String, enum: ['goout', 'eventbrite', 'lineup', 'other'], default: 'other' },
    externalUrl: { type: String, required: true },

    // Event details
    venue: String,
    city: String,
    address: String,
    startsAt: { type: Date, required: true, index: true },
    endsAt: Date,
    minAge: { type: Number, default: 0 },
    tags: [String],
    priceFrom: Number,
    currency: { type: String, default: 'ILS' },

    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'cancelled'],
      default: 'draft',
      index: true,
    },
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, startsAt: 1 });

export const Event = mongoose.model('Event', eventSchema);
