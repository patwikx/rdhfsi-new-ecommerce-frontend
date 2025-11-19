# User Account Pages Implementation Tasks

## Overview
Create user account management pages: Wishlist, Addresses, Security, Templates, Quotes, and Bulk Order.

## Tasks Checklist

### 1. Wishlist Page (`/wishlist`) ✅ COMPLETE
- [x] Create `/wishlist/page.tsx`
- [x] Display all wishlist items
- [x] Add to cart from wishlist
- [x] Remove from wishlist
- [x] Empty state
- [x] Move to cart (all items)

### 2. Profile - Addresses (`/profile/addresses`) ✅ COMPLETE
- [x] Create `/profile/addresses/page.tsx`
- [x] List all saved addresses
- [x] Add new address
- [x] Edit address
- [x] Delete address
- [x] Set default address
- [x] Set billing address

### 3. Profile - Security (`/profile/security`) ✅ COMPLETE
- [x] Create `/profile/security/page.tsx`
- [x] Change password form
- [ ] Two-factor authentication (future)
- [ ] Login history (future)
- [ ] Active sessions (future)

### 4. Profile - Templates (`/profile/templates`) ✅ COMPLETE
- [x] Create `/profile/templates/page.tsx`
- [x] List reorder templates
- [x] Delete template
- [x] Quick reorder from template
- [ ] Create new template (future - from cart)
- [ ] Edit template (future)

### 5. Profile - Quotes (`/profile/quotes`) ✅ COMPLETE
- [x] Create `/profile/quotes/page.tsx`
- [x] List all quote requests
- [x] Filter by status
- [x] View quote details

### 6. Quote Details (`/quote/[id]`) ✅ COMPLETE
- [x] Create `/quote/[id]/page.tsx`
- [x] Display quote details
- [x] Show quoted prices
- [x] Show admin response
- [ ] Accept/decline quote (future - admin feature)
- [ ] Convert to order (future - admin feature)

### 7. Bulk Order (`/bulk-order`) ✅ COMPLETE
- [x] Create `/bulk-order/page.tsx`
- [x] Manual entry form
- [x] Product lookup by SKU
- [x] Quantity input
- [x] Add to cart (bulk)
- [x] Request quote (bulk)
- [ ] CSV upload (future enhancement)

### 8. Server Actions ✅ COMPLETE
- [x] Wishlist actions (already exist in store)
- [x] Address CRUD actions
- [x] Password change action
- [x] Template CRUD actions
- [x] Quote CRUD actions
- [x] Bulk order processing

### 9. Components
- [ ] Address card component
- [ ] Address form dialog
- [ ] Template card component
- [ ] Quote card component
- [ ] Bulk order CSV uploader
- [ ] Bulk order product row

## Implementation Order
1. Wishlist page (simplest)
2. Profile/Addresses
3. Profile/Security
4. Profile/Templates
5. Profile/Quotes
6. Quote details page
7. Bulk order page
