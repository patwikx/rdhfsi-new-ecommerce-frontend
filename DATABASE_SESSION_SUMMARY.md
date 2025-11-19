# Database-Backed Session System

## Overview
Sessions are now tracked in the database with automatic expiration and refresh.

## How It Works

### 1. On Login
- User logs in with credentials
- JWT token created (valid for 30 minutes)
- **Session record created in database** (expires in 30 minutes)
- Session token stored in JWT

### 2. While Browsing
- **Client-side**: SessionValidator checks every 1 minute
- **Server-side**: Every request validates against database
- **On activity**: Session expiration refreshed by 30 minutes
- If database session expired → Graceful logout with animation

### 3. On Browser Close
- SessionValidator stops running
- Database session stops being refreshed
- After 30 minutes of inactivity → Session expires in database
- On reopen → Server checks database → Session invalid → Redirect to login

### 4. Graceful Logout
- Detects expired session
- Shows full-screen blur overlay
- Displays "Session Expired - Logging out..." for 3 seconds
- Calls `signOut()` to clear JWT
- Redirects to login page

## Files Created

1. **lib/actions/session-management-actions.ts**
   - `createSessionRecord()` - Create session in DB
   - `validateSession()` - Check if session valid
   - `refreshSession()` - Extend session expiration
   - `deleteUserSessions()` - Force logout
   - `cleanupExpiredSessions()` - Remove expired sessions

2. **app/api/auth/validate-session/route.ts**
   - API endpoint to validate and refresh sessions
   - Called by SessionValidator every minute

3. **Updated auth.ts**
   - Creates database session on login
   - Validates database session on every request
   - Returns empty session if DB session invalid

4. **Updated SessionValidator**
   - Checks `/api/auth/validate-session` every minute
   - Shows graceful logout animation
   - Properly signs out user

## Configuration

**Session Duration**: 30 minutes
- Set in `session-management-actions.ts` (lines 13, 70)
- Change `setMinutes(30)` to desired duration

**Check Interval**: 1 minute
- Set in `session-validator.tsx` (line 66)
- Change `60 * 1000` to desired interval

**JWT Duration**: 30 minutes
- Set in `auth.ts` (line 19)
- Change `maxAge: 30 * 60` to desired duration

## Testing

1. **Login** → Session created in database
2. **Wait 30 minutes** without activity
3. **Next check** (within 1 minute) detects expired session
4. **See graceful logout** animation for 3 seconds
5. **Redirected** to login page

## Database Session Table

Uses existing `Session` model in Prisma:
```prisma
model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Benefits

✅ Sessions tracked in database (source of truth)
✅ Automatic expiration after inactivity
✅ Works when browser is closed
✅ Graceful logout with animation
✅ Server-side validation on every request
✅ Client-side validation every minute
✅ Session refresh on activity

## Maintenance

**Cleanup expired sessions** (optional cron job):
```typescript
import { cleanupExpiredSessions } from '@/lib/actions/session-management-actions';

// Run daily
const result = await cleanupExpiredSessions();
console.log(`Deleted ${result.deletedCount} expired sessions`);
```

**Force logout user**:
```typescript
import { deleteUserSessions } from '@/lib/actions/session-management-actions';

await deleteUserSessions(userId);
```
