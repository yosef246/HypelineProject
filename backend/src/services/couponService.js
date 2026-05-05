import { Coupon } from '../models/Coupon.js';
import { generateCouponCode } from '../utils/helpers.js';

/**
 * Create a unique coupon code for a referral.
 * Tries up to 5 times to avoid collision (extremely rare with 8-char alphabet).
 */
export const createUniqueCoupon = async ({ referral, campaign, marketer, discountPercent = 0, expiresAt }) => {
  for (let i = 0; i < 5; i++) {
    const code = generateCouponCode();
    const exists = await Coupon.exists({ code });
    if (!exists) {
      const coupon = await Coupon.create({
        code,
        referral: referral._id,
        campaign: campaign._id,
        marketer: marketer._id,
        discountType: 'percent',
        discountValue: discountPercent,
        expiresAt: expiresAt || campaign.endsAt,
      });
      return coupon;
    }
  }
  throw new Error('Could not generate a unique coupon code after 5 tries');
};
