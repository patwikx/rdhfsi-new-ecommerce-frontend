import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create VAT 12% Tax Rate
  const vat12 = await prisma.taxRate.upsert({
    where: { code: 'VAT12' },
    update: {},
    create: {
      name: 'VAT 12%',
      code: 'VAT12',
      description: 'Standard Value Added Tax rate for the Philippines',
      rate: 12.00,
      country: 'Philippines',
      provinces: [], // Empty array means applies to all provinces
      cities: [], // Empty array means applies to all cities
      applicableCategories: [], // Empty array means applies to all categories
      excludedCategories: [], // No excluded categories
      isDefault: true, // This is the default tax rate
      isCompound: false,
      priority: 100, // High priority
      isActive: true,
      validFrom: new Date(),
      validUntil: null, // No expiration
    },
  });

  console.log('✅ Created/Updated VAT 12% tax rate:', vat12);

  // Optional: Create Zero-Rated tax (for exports, etc.)
  const zeroRated = await prisma.taxRate.upsert({
    where: { code: 'ZERO' },
    update: {},
    create: {
      name: 'Zero-Rated',
      code: 'ZERO',
      description: 'Zero-rated transactions (exports, etc.)',
      rate: 0.00,
      country: 'Philippines',
      provinces: [],
      cities: [],
      applicableCategories: [],
      excludedCategories: [],
      isDefault: false,
      isCompound: false,
      priority: 50,
      isActive: true,
      validFrom: new Date(),
      validUntil: null,
    },
  });

  console.log('✅ Created/Updated Zero-Rated tax:', zeroRated);

  // Optional: Create VAT-Exempt tax
  const vatExempt = await prisma.taxRate.upsert({
    where: { code: 'EXEMPT' },
    update: {},
    create: {
      name: 'VAT-Exempt',
      code: 'EXEMPT',
      description: 'VAT-exempt transactions',
      rate: 0.00,
      country: 'Philippines',
      provinces: [],
      cities: [],
      applicableCategories: [],
      excludedCategories: [],
      isDefault: false,
      isCompound: false,
      priority: 25,
      isActive: true,
      validFrom: new Date(),
      validUntil: null,
    },
  });

  console.log('✅ Created/Updated VAT-Exempt tax:', vatExempt);

  // ============================================
  // DISCOUNT TYPES
  // ============================================
  console.log('\n📋 Creating discount types...');

  // Senior Citizen Discount (20% as per Philippine law)
  const seniorDiscount = await prisma.discountType.upsert({
    where: { code: 'SENIOR' },
    update: {},
    create: {
      code: 'SENIOR',
      name: 'Senior Citizen Discount',
      description: '20% discount for senior citizens (60 years old and above)',
      discountPercent: 20.00,
      discountAmount: null,
      requiresVerification: true,
      requiresCode: false,
      minPurchaseAmount: null,
      maxDiscountAmount: null,
      applicableToSale: true,
      excludedCategoryIds: [],
      includedCategoryIds: [],
      excludedProductIds: [],
      priority: 90,
      isActive: true,
      validFrom: new Date(),
      validUntil: null,
      usageCount: 0,
      usageLimit: null,
    },
  });

  console.log('✅ Created/Updated Senior Citizen Discount:', seniorDiscount.code);

  // PWD Discount (20% as per Philippine law)
  const pwdDiscount = await prisma.discountType.upsert({
    where: { code: 'PWD' },
    update: {},
    create: {
      code: 'PWD',
      name: 'PWD Discount',
      description: '20% discount for Persons with Disability',
      discountPercent: 20.00,
      discountAmount: null,
      requiresVerification: true,
      requiresCode: false,
      minPurchaseAmount: null,
      maxDiscountAmount: null,
      applicableToSale: true,
      excludedCategoryIds: [],
      includedCategoryIds: [],
      excludedProductIds: [],
      priority: 90,
      isActive: true,
      validFrom: new Date(),
      validUntil: null,
      usageCount: 0,
      usageLimit: null,
    },
  });

  console.log('✅ Created/Updated PWD Discount:', pwdDiscount.code);

  // ============================================
  // PROMOTIONAL COUPONS
  // ============================================
  console.log('\n🎟️  Creating promotional coupons...');

  // Welcome Coupon - 10% off
  const welcomeCoupon = await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      name: 'Welcome Discount',
      description: 'Get 10% off your first order',
      discountType: 'PERCENTAGE',
      discountValue: 10.00,
      minPurchaseAmount: 1000.00,
      maxDiscountAmount: 500.00,
      applicableCategories: [],
      applicableProducts: [],
      excludedCategories: [],
      excludedProducts: [],
      usageLimit: null,
      usageCount: 0,
      perUserLimit: 1,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true,
      isPublic: true,
      stackable: false,
    },
  });

  console.log('✅ Created/Updated Welcome Coupon:', welcomeCoupon.code);

  // Free Shipping Coupon
  const freeShippingCoupon = await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      name: 'Free Shipping',
      description: 'Free shipping on orders over ₱2,000',
      discountType: 'FREE_SHIPPING',
      discountValue: 0.00,
      minPurchaseAmount: 2000.00,
      maxDiscountAmount: null,
      applicableCategories: [],
      applicableProducts: [],
      excludedCategories: [],
      excludedProducts: [],
      usageLimit: null,
      usageCount: 0,
      perUserLimit: null,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      isActive: true,
      isPublic: true,
      stackable: true,
    },
  });

  console.log('✅ Created/Updated Free Shipping Coupon:', freeShippingCoupon.code);

  // Holiday Sale - 15% off
  const holidayCoupon = await prisma.coupon.upsert({
    where: { code: 'HOLIDAY15' },
    update: {},
    create: {
      code: 'HOLIDAY15',
      name: 'Holiday Sale',
      description: '15% off on all items',
      discountType: 'PERCENTAGE',
      discountValue: 15.00,
      minPurchaseAmount: 2500.00,
      maxDiscountAmount: 1000.00,
      applicableCategories: [],
      applicableProducts: [],
      excludedCategories: [],
      excludedProducts: [],
      usageLimit: 1000,
      usageCount: 0,
      perUserLimit: 1,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      isActive: true,
      isPublic: true,
      stackable: false,
    },
  });

  console.log('✅ Created/Updated Holiday Coupon:', holidayCoupon.code);

  // Fixed Amount Coupon - ₱200 off
  const fixedCoupon = await prisma.coupon.upsert({
    where: { code: 'SAVE200' },
    update: {},
    create: {
      code: 'SAVE200',
      name: 'Save ₱200',
      description: 'Get ₱200 off on orders over ₱3,000',
      discountType: 'FIXED_AMOUNT',
      discountValue: 200.00,
      minPurchaseAmount: 3000.00,
      maxDiscountAmount: null,
      applicableCategories: [],
      applicableProducts: [],
      excludedCategories: [],
      excludedProducts: [],
      usageLimit: 500,
      usageCount: 0,
      perUserLimit: 2,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
      isPublic: true,
      stackable: false,
    },
  });

  console.log('✅ Created/Updated Fixed Amount Coupon:', fixedCoupon.code);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - 3 Tax Rates created');
  console.log('   - 2 Discount Types created (Senior, PWD)');
  console.log('   - 4 Promotional Coupons created');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
