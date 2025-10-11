# Changelog

## [Unreleased] - 2025-10-11

### Security Enhancement: Plan Overwrite Protection

#### Added
- **Plan Overwrite Protection**: Critical safety mechanism to prevent accidental plan deletion
  - Checks for existing plan before creation in `handleCreatePlan()`
  - Shows confirmation dialog when user has existing plan:
    - "您已經有一個旅行計劃。創建新計劃將覆蓋現有計劃。確定要繼續嗎？"
  - User options:
    - Cancel → Redirects to existing plan (preserves data)
    - Confirm → Proceeds with new plan creation (overwrites data)

#### Why This Matters
- **Context**: Users with existing plans already have auto-redirect on login (via useEffect in App.js)
- **Edge Case Protection**: Firebase sync delays could expose PlanSelection screen
- **Data Loss Prevention**: Without protection, clicking "Create New Plan" would silently overwrite all existing travel data
- **User Safety**: Confirmation dialog adds critical safety layer for user data protection

#### Technical Implementation
- Location: `src/components/App.js` - `handleCreatePlan()` function (lines 818-863)
- Method: Async Firebase check before plan creation
- Firebase Query: `get(ref(database, 'users/${user.uid}'))` to check for existing planId
- Dialog: Native `window.confirm()` with clear Chinese message
- Fallback: Automatically redirect to existing plan if user cancels

---

## [Previous Updates] - 2025-10-06

### Major Restructuring: Pre-Trip Planning & Accommodation Management

#### Architecture Changes
- **New Tab Structure**: Reorganized from 3 main tabs to 2 main tabs
  - Old: 旅行時間 | 機票確認 | 每日規劃
  - New: 行前安排 | 每日規劃
- **Nested Tab System**: Introduced "行前安排" (Pre-Trip Planning) as container for:
  - 旅行時間 (Travel Time)
  - 機票確認 (Flight Confirmation)
  - 住宿確認 (Accommodation Confirmation) - NEW

#### New Feature: Accommodation Management
- **Complete Accommodation System** (mirroring flight system):
  - **新增住宿**: Form to add accommodation options
  - **住宿列表**: View and compare all accommodations
  - **確認住宿**: Confirm and manage booking details
- **Accommodation Fields**:
  - Name, Check-in/Check-out datetime
  - Price (with $-prefixed badge)
  - Address (clickable - opens Google Maps)
  - Nearby Station (with train icon)
  - Amenities (multi-select tags: 吹風機, 毛巾, 洗衣機, 烘衣機, 熱水壺, 其他)
  - Notes (optional)
- **Accommodation Features**:
  - Checkbox selection with confirmation modal
  - Auto-navigate to confirmation tab when accommodation confirmed
  - Vote and comment system (collaborative decision-making)
  - Edit and delete options
  - Firebase real-time synchronization

#### Enhanced Components
- **TagSelector.js**: Extended with multiple selection support
  - Single-select mode (default): Select one option
  - Multiple-select mode: Select multiple options (amenities)
  - Custom "其他" input for both modes
  - Visual tag display with remove buttons
- **PreTripTab.js**: New container component managing nested navigation
- **AccommodationForm.js**: Accommodation input form with datetime pickers and tag selector
- **AccommodationCard.js**: Display card with Google Maps integration
- **ConfirmedAccommodationTicket.js**: Ticket-style confirmation display
- **AccommodationTab.js**: Three-tab accommodation management interface

#### Technical Improvements
- **Firebase Data Structure**: Added `accommodations` and `confirmedAccommodation` nodes
- **State Management**: Complete accommodation state management in App.js
- **Responsive Design**: Mobile-optimized for iPhone 12+ (≥390px)
- **Code Organization**: Modular component structure maintained
- **Design Consistency**: Matches existing coral pink/peach color scheme

---

## [Previous Updates] - 2025-10-06

### Added
- **Flight Selection with Checkbox**: Added checkbox next to flight price for easier selection on mobile devices
- **Confirmation Modal**: Interactive confirmation dialog when selecting flights
- **Flight Reselection**: Users can now reselect confirmed flights from the confirmed flight page
- **Visual Feedback**: Selected flight cards show pink border, unselected cards become dimmed
- **24-Hour Time Format**: Confirmed flight tickets display time in 24-hour format
- **Responsive Purchase Date Field**: Optimized for iPhone 12 and smaller devices (≤390px)

### Changed
- **Flight Confirmation Flow**:
  - Old: Select flight → Click "Confirm Selected Flight" button → Go to confirmation page
  - New: Check checkbox → Confirm in modal → Automatically navigate to confirmation page
- **Flight Selection Sync**: Fixed issue where confirmed flight data was not syncing with selected flight (async state update bug)
- **Flight List Interaction**: All flight cards remain interactive even after confirmation, allowing easy reselection

### Fixed
- **Flight Time Synchronization**: Confirmed flight ticket now correctly displays the selected flight's departure and arrival times
- **State Update Bug**: Fixed async state update issue in `confirmSelectedFlight()` by passing `flightId` parameter directly
- **Daily Plan Deselection**: Users can now deselect completed days, manual settings override automatic past-date completion
- **Daily Plan Sorting**: Days now stay in numerical order when checked, providing better visual feedback

### Daily Planning Enhancements
- **Address Field with Google Maps**: Added optional address field to location form
- **Google Maps Integration**: Click/tap address to open Google Maps navigation in new tab
- **Tag-Based Selection**: Replaced dropdowns with mobile-friendly tag selection UI
- **Custom Input Support**: "其他" (Other) option allows custom text input for all categories
- **Improved Mobile UX**: Tags are larger, easier to tap, with visual feedback on selection
- **Better Accessibility**: Tags support hover states and active states for better user feedback

### Technical Details
- Modified `confirmSelectedFlight(flightId)` to accept flight ID parameter instead of relying on async state
- Added `clearConfirmedFlight()` function to reset confirmed flight selection
- Updated `FlightCard` component with `showCheckbox`, `isChecked`, and `onCheckboxChange` props
- Improved responsive CSS for `.confirmation-field` inputs with mobile breakpoint at 390px
- Removed auto-sorting that moved completed days to bottom
- Created `TagSelector` component for mobile-optimized tag-based selection
- Updated `LocationForm` to use `TagSelector` instead of `CustomDropdown` components
- Added `address` field to location data structure
- Updated `LocationCard` to display clickable address with map pin icon
- Enhanced CSS with `.tag-selector`, `.tag-container`, `.tag-custom-input-container`, and `.location-address` styles

---

## Previous Updates

See commit history for earlier changes.
