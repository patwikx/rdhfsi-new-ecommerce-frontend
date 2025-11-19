# Database Seeding

This directory contains the seed file for initializing the database with essential data.

## What Gets Seeded

The seed file (`seed.ts`) creates the following tax rates:

### 1. VAT 12% (Default)
- **Code**: `VAT12`
- **Rate**: 12.00%
- **Description**: Standard Value Added Tax rate for the Philippines
- **Status**: Default tax rate, applies to all products and categories
- **Priority**: 100 (highest)

### 2. Zero-Rated
- **Code**: `ZERO`
- **Rate**: 0.00%
- **Description**: Zero-rated transactions (exports, etc.)
- **Priority**: 50

### 3. VAT-Exempt
- **Code**: `EXEMPT`
- **Rate**: 0.00%
- **Description**: VAT-exempt transactions
- **Priority**: 25

## How to Run

### First Time Setup
1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Run the seed:
   ```bash
   npm run db:seed
   ```

### After Database Reset
If you reset your database with `npx prisma migrate reset`, the seed will run automatically.

### Manual Seeding
You can also run the seed manually:
```bash
npx prisma db seed
```

## How Tax Rates Work

The `TaxRate` model in your schema supports:

- **Geographic targeting**: Apply different rates by country, province, or city
- **Category-based rules**: Apply specific rates to certain product categories
- **Priority system**: Higher priority rates are applied first
- **Date ranges**: Set validity periods for tax rates
- **Default rate**: Mark one rate as default (VAT 12% in this case)

## Customizing Tax Rates

To add or modify tax rates, edit `prisma/seed.ts` and run the seed command again. The `upsert` operation ensures existing records are updated rather than duplicated.

### Example: Adding a Special Tax Rate

```typescript
const specialRate = await prisma.taxRate.upsert({
  where: { code: 'SPECIAL' },
  update: {},
  create: {
    name: 'Special Rate 5%',
    code: 'SPECIAL',
    description: 'Special reduced rate for specific categories',
    rate: 5.00,
    country: 'Philippines',
    provinces: [],
    cities: [],
    applicableCategories: ['category-id-1', 'category-id-2'], // Only these categories
    excludedCategories: [],
    isDefault: false,
    isCompound: false,
    priority: 75,
    isActive: true,
    validFrom: new Date(),
    validUntil: null,
  },
});
```

## Integration with Orders

When creating orders, the system will:
1. Look up applicable tax rates based on priority
2. Apply the default rate (VAT 12%) if no specific rules match
3. Calculate tax amount and store it in `Order.taxAmount`
4. Create detailed breakdown in `OrderTaxBreakdown` for reporting

## Notes

- The seed uses `upsert` to prevent duplicate entries
- Running the seed multiple times is safe
- Tax rates can be managed through an admin interface (to be implemented)
