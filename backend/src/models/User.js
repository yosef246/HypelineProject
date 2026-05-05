import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const ROLES = ['producer', 'marketer', 'customer', 'admin'];
const STATUSES = ['pending', 'active', 'blocked', 'rejected'];

const bankDetailsSchema = new Schema(
  {
    accountHolder: String,
    bankCode: String, // קוד בנק (לדוגמה 12 - הפועלים)
    branchCode: String,
    accountNumber: String,
    idNumber: String, // ת"ז לחשבונית
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, required: true, trim: true, index: true },
    password: { type: String, required: true, select: false, minlength: 8 },
    role: { type: String, enum: ROLES, required: true, index: true },
    status: { type: String, enum: STATUSES, default: 'pending', index: true },
    city: String,

    // Producer fields
    businessName: String,
    activityType: String, // קלאב / אירועים פרטיים / פסטיבל / וכו'

    // Marketer fields
    username: { type: String, sparse: true, unique: true, lowercase: true, trim: true },
    bankDetails: bankDetailsSchema,

    // Verification
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    phoneVerified: { type: Boolean, default: false },

    // Token rotation
    refreshTokenVersion: { type: Number, default: 0 },
    lastLoginAt: Date,

    // Compliance
    termsAcceptedAt: { type: Date, required: true, default: Date.now },
    privacyAcceptedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Strip secrets when serialized
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject({ versionKey: false });
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.refreshTokenVersion;
  return obj;
};

userSchema.statics.ROLES = ROLES;
userSchema.statics.STATUSES = STATUSES;

export const User = mongoose.model('User', userSchema);
