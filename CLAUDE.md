# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Travel PWA** is a collaborative travel planning Progressive Web App built with React 19 and Firebase. It supports 2-user real-time collaboration with Google authentication, allowing travel partners to plan trips together across dates, flights, itineraries, and packing lists.

**Live Demo**: https://travel-fd.web.app
**Firebase Project**: `travel-fd`

** SECURITY NOTE**: This project is NOT intended for public GitHub. All Firebase credentials are stored locally in `.env` file.

## IMPORTANT: Console Warnings

### Cross-Origin-Opener-Policy (COOP) Warning - SAFE TO IGNORE

**Warning Message**:

```
Cross-Origin-Opener-Policy policy would block the window.close call.
cb=gapi.loaded_0?le=scs:195
```

**Why This Happens**:

- Firebase Auth uses `signInWithPopup()` for Google OAuth login
- Google's OAuth page sets strict COOP headers for security
- Browser prevents popup window close detection due to cross-origin policy
- This is **EXPECTED BEHAVIOR** from Google's OAuth security

**Is This a Problem?**:

- **NO** - Authentication works perfectly
- **NO** - No security risk
- **NO** - No functionality impact
- **Safe to ignore** - This is a browser informational message, not an error

**Why We Use Popup Mode**:

1. **Better UX** - No page reload, instant feedback
2. **PWA Compatible** - Works with Service Workers
3. **Reliable** - No redirect timing issues
4. **Recommended** - Firebase official documentation recommends popup for web apps

**Alternative Solutions (NOT RECOMMENDED)**:

- `signInWithRedirect()` - Causes issues with Service Workers and PWA
- Custom COOP headers - Requires server configuration, breaks Google OAuth
- Suppressing console warnings - Hides potentially useful information

**Action Required**:

- **NONE** - Simply ignore this warning in the browser console
- **DO NOT** attempt to "fix" this warning by changing auth methods
- **DO NOT** modify COOP headers (will break authentication)

### auth/popup-closed-by-user - User Cancelled Login

**Error Message**:

```
Firebase: Error (auth/popup-closed-by-user)
```

**Why This Happens**:

- User clicks "Continue with Google"
- Popup window opens with Google sign-in
- User closes the popup before completing sign-in
- Firebase throws this error

**Is This a Problem?**:

- **NO** - This is expected user behavior
- **NO** - Not a technical error
- **Already handled** - Error is silently caught and ignored in `AuthContext.js`

**Error Handling**:

```javascript
// In AuthContext.js
if (error.code === "auth/popup-closed-by-user") {
  return; // Silently ignore, user intentionally cancelled
}
```

**Action Required**:

- **NONE** - User can simply click login again when ready

## Development Commands

```bash
# Start development server
npm start                    # Default port 3000
PORT=5175 npm start         # Custom port

# Build and deployment
npm run build               # Create production build
firebase deploy             # Deploy everything
firebase deploy --only hosting        # Deploy hosting only
firebase deploy --only database       # Deploy security rules only

# Firebase management
firebase login
firebase use travel-fd
```

## Architecture

### File Organization (Modularized)

```
src/
 components/
    App.js                      # Main app orchestrator
    Login.js                    # Google Sign-In UI
    PlanSelection.js            # Plan creation/join UI
    ErrorBoundary.js            # Error recovery
    common/                     # Reusable UI components
       CustomDropdown.js       # Custom select dropdown
    flights/                    # Flight booking components
       FlightForm.js           # Flight input form
       FlightCard.js           # Flight display card
    dailyPlan/                  # Daily planning components
       LocationForm.js         # Location input form
       LocationCard.js         # Location display card
       DayAccordion.js         # Day accordion container
    tabs/                       # Tab page components
        TravelTimeTab.js        # Tab 1: Date selection
        FlightTab.js            # Tab 2: Flight booking
        DailyPlanTab.js         # Tab 3: Daily itinerary
        EssentialsTab.js        # Tab 4: Packing list
 styles/                         # CSS stylesheets
 contexts/                       # React Context (AuthContext)
 config/                         # Firebase configuration
 constants/                      # App-wide constants
    options.js                  # Dropdown options, tabs config
 utils/                          # Utility functions
    dateHelpers.js              # Date calculation utilities
    inviteCodeGenerator.js     # Secure code generation
    firebaseHelpers.js          # User avatar utilities
    reportWebVitals.js          # Performance monitoring
    serviceWorker.js            # PWA service worker
 docs/                           # Documentation
```

### Core Data Flow

1. **Authentication**: Google Sign-In via Firebase Auth → AuthContext → App
2. **Plan Creation**: User creates plan → Firebase writes to `travelPlans/{planId}` → Sets `users/{uid}/planId`
3. **Invite System**: Generate 6-char code → Write to `invites/{code}` (24hr expiry) → Partner joins via code
4. **Real-time Sync**: `onValue()` listener on `travelPlans/{planId}` → Updates local state → Debounced writes back to Firebase

### Firebase Database Structure

```
travelPlans/
  {planId}/
    ownerUid: string
    users: { [uid]: true }
    startDate: string
    endDate: string
    flights: { [id]: {...} }
    locations: { [day]: [...] }
    essentials: { [id]: {...} }

invites/
  {code}/           # 6-character invite code
    planId: string
    status: "pending" | "used"
    timestamp: number
    expiresAt: number  # 24 hours from creation

inviteAuth/         # Temporary access during join
  {planId}/
    {uid}: { grantedAt: number }

users/
  {uid}/
    planId: string
```

### Security Rules (`database.rules.json`)

- **travelPlans**: Read/write if user in `users` list OR owner OR has temporary `inviteAuth`
- **invites**: Anyone authenticated can read; only creator can write if pending
- **inviteAuth**: User can only read/write their own temp access
- **users**: User can only read/write their own data

## Critical Implementation Details

### Performance Optimizations

1. **Debounced Firebase Updates**: 1-second debounce on all writes (90% reduction)
2. **Component Memoization**: All Tab components wrapped in `React.memo`
3. **Calculation Caching**: `useMemo` for `sortedEssentials` and other computed values
4. **Loop Prevention**: `isUpdatingFromFirebase` ref prevents infinite Firebase ↔ React loops

### Security Implementations

1. **XSS Protection**: All user content sanitized with DOMPurify before rendering
2. **Input Validation**: All inputs have `maxLength` constraints
3. **Secure Invite Codes**: Generated using `crypto.getRandomValues()` (4 bytes → 6 chars)
4. **Invite Expiration**: 24-hour automatic expiration enforced in security rules
5. **Temporary Auth**: `inviteAuth` mechanism grants read access during join process
6. **Plan Overwrite Protection**: Prevents accidental plan deletion with confirmation dialog before creating new plan

### Join Plan Flow (Important!)

When a user joins via invite code:

1. Read invite from `invites/{code}` and validate expiration
2. Write temporary access to `inviteAuth/{planId}/{uid}`
3. Read plan data (allowed by `inviteAuth` in security rules)
4. Add user to `users/{uid}/planId` and `travelPlans/{planId}/users/{uid}`
5. Clean up: delete invite and `inviteAuth` entry

**Critical**: The `.read` rule for `travelPlans` MUST check `inviteAuth` to allow step 3.

### Plan Overwrite Protection (Important!)

When a user attempts to create a new plan via `handleCreatePlan`:

1. Check Firebase `users/{uid}` for existing `planId`
2. If plan exists, show confirmation dialog: "您已經有一個旅行計劃。創建新計劃將覆蓋現有計劃。確定要繼續嗎？"
3. If user cancels: Redirect to existing plan (`setPlanId(existingPlanId)`)
4. If user confirms: Proceed with plan creation (overwrites existing plan)

**Why This Matters**:

- Users already have auto-redirect to existing plan on login (via useEffect in App.js)
- Edge cases (Firebase sync delays) could allow users to see PlanSelection screen
- Without this check, clicking "Create New Plan" would silently overwrite existing plan data
- Confirmation dialog prevents accidental data loss

### PWA Icon Generation

Icons are generated using `pwa-asset-generator` from SVG source:

```bash
pwa-asset-generator icon-192-maskable.svg public/ \
  --background "#ba68c8" \
  --padding "0" \
  --icon-only \
  --manifest public/manifest.json \
  --type png
```

This generates:

- `manifest-icon-192.maskable.png`
- `manifest-icon-512.maskable.png`
- `apple-icon-180.png`

**Important**: Must use PNG for PWA icons, not SVG (iOS compatibility).

## Code Modularization

### Modularization Strategy (Completed)

The app has been refactored from a monolithic 1,486-line App.js to a modular architecture:

**Principles**:

- **No design changes** - UI/UX remains identical
- **No functionality changes** - All features work exactly as before
- **Improved reusability** - Components can be reused across the app
- **Better maintainability** - Easier to locate and modify code

**What Was Modularized**:

1. **Constants** (`src/constants/options.js`)

   - Airline options, transportation options, time periods, categories, tabs config
   - Single source of truth for dropdown values

2. **Utilities** (`src/utils/`)

   - `dateHelpers.js`: Date calculations, daily plan generation
   - `inviteCodeGenerator.js`: Secure random code generation
   - `firebaseHelpers.js`: User avatar initials and colors

3. **Common Components** (`src/components/common/`)

   - `CustomDropdown.js`: Reusable dropdown with keyboard support

4. **Feature Components** (`src/components/flights/`, `src/components/dailyPlan/`)

   - Separated by feature domain
   - Self-contained with clear props interface

5. **Page Components** (`src/components/tabs/`)
   - Each tab is a separate component
   - Props-based communication with parent App.js

**Legacy Code Note**:

- Old inline Tab1-Tab4 definitions still exist in App.js but are unused
- These are safe to remove but kept for reference during transition
- ESLint warnings about unused variables (Tab1, Tab2, Tab3, Tab4) can be ignored

**Import Pattern**:

```javascript
// In App.js
import { TABS } from "../constants/options";
import { calculateDaysFromDates } from "../utils/dateHelpers";
import TravelTimeTab from "./tabs/TravelTimeTab";
```

## Environment Configuration

Create `.env` file with Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_DATABASE_URL=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

## Known Issues & Constraints

1. **2-User Limit**: Enforced in UI and security rules
2. **Invite Code Length**: Hardcoded to 6 characters (input has `maxLength="6"`)
3. **Web Vitals v5**: Uses `onINP` instead of deprecated `onFID`
4. **ESLint Warnings**: Two intentional warnings in App.js:
   - `EXPIRATION_TIME` unused (kept for documentation)
   - `useMemo` dependency on `essentials` (intentional)

## Testing Locally

1. Ensure Firebase project is set to `travel-fd`
2. Security rules must be deployed before testing invite flow
3. Use different browsers/incognito for multi-user testing
4. Check browser console for detailed join flow logs (all steps are logged)

## Deployment Checklist

1. Build passes: `npm run build`
2. Security rules deployed: `firebase deploy --only database`
3. Hosting deployed: `firebase deploy --only hosting`
4. Test invite flow on live site
5. Verify PWA icons show correctly (may need to reinstall PWA)

## Recent Updates (2025-10-05)

### Design System Redesign

The application received a complete visual overhaul with a new warm, elegant color palette:

**Color Palette**:

- `#D76C82` (Coral Pink) - Primary accent, outbound flights
- `#FFB4A2` (Peach) - Secondary accent, return flights
- `#E5989B` (Rose Pink) - Tags and labels
- `#B5828C` (Mauve Gray) - Primary text and borders
- `#EBE8DB` (Cream) - Secondary backgrounds
- `#FFCDB2` (Light Peach) - Hover states

**Key Changes**:

- Removed deep rose (`#B03052`) and dark brown (`#3D0301`) from color scheme
- Softer, more approachable visual design
- Improved accessibility with better contrast ratios

### Flight Management Updates

1. **Form Layout**: Date fields moved to header row next to flight type labels
2. **Time Display**: Simplified to show only time (removed redundant date fields)
3. **Visual Distinction**: Clear color differentiation between outbound/return
4. **Form Notes**: Enhanced placeholder readability (35% opacity) with responsive typography

### Daily Planning Enhancements

1. **Date-based Completion**: Past days automatically marked as completed
2. **Persistent Days**: Fixed bug where days disappeared after deleting locations
3. **Creator Attribution**: Shows who added each location with Gmail icon
4. **Sorting Logic**: Completed/past days move to bottom while remaining viewable

### Technical Notes

- All CSS updates use the new color variables
- Responsive font sizing implemented across all form elements
- Improved hover states with subtle cream backgrounds and soft shadows

## Recent Updates (2025-10-11)

### Security Enhancements

1. **Plan Overwrite Protection**: Added safety mechanism to prevent accidental plan deletion
   - Checks for existing plan before creation
   - Shows confirmation dialog: "您已經有一個旅行計劃。創建新計劃將覆蓋現有計劃。確定要繼續嗎？"
   - Redirects to existing plan if user cancels
   - Prevents data loss from accidental clicks on "Create New Plan"

### Why This Update

- Users with existing plans already have auto-redirect on login
- Edge cases (Firebase sync delays) could expose PlanSelection screen
- Without protection, "Create New Plan" would silently overwrite all existing data
- Confirmation dialog adds critical safety layer for user data protection


