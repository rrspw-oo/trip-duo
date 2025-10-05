# Changelog

All notable changes to the Travel PWA project will be documented in this file.

## [2025-10-05] - UI/UX Redesign & Feature Updates

### 🎨 Design System Overhaul
- **New Color Palette**: Implemented warm, elegant color scheme
  - Primary: `#D76C82` (Coral Pink)
  - Secondary: `#FFB4A2` (Peach)
  - Accents: `#E5989B` (Rose Pink), `#B5828C` (Mauve Gray)
  - Backgrounds: `#EBE8DB` (Cream), `#FFCDB2` (Light Peach)
- **Typography Updates**: Changed primary text color to softer `#B5828C` (removed dark brown `#3D0301`)
- **Button Styling**: Updated all buttons with light backgrounds and colored borders for a softer appearance
- **Tag/Label Design**: Applied semi-transparent backgrounds with colored borders for better visual hierarchy

### ✈️ Flight Management
- **Form Layout Improvement**:
  - Moved date fields to header row next to "去程"/"回程" labels
  - Date displays as plain text without background or borders
  - Time inputs now show only time (removed redundant date fields)
- **Flight Cards**: Enhanced visual distinction between outbound and return flights
  - Outbound: Coral pink (`#D76C82`)
  - Return: Peach (`#FFB4A2`)
- **Hover Effects**: Optimized flight card hover with subtle cream background and soft shadows
- **Form Notes**:
  - Placeholder text opacity reduced to 35% for better readability
  - Responsive font sizing (14px desktop → 12px tablet → 11px mobile)

### 📅 Daily Planning
- **Completion Status**:
  - Implemented date-based auto-completion for past days
  - Past days automatically move to bottom and display as greyed out
  - Completed days remain viewable but visually distinguished
- **Day Persistence**: Fixed bug where days would disappear after deleting all locations
  - All days now always display from Day 1 to totalDays
- **Creator Attribution**: Added email display with Gmail icon for location creators

### 🎯 Responsive Design
- Enhanced mobile/tablet experience with optimized font sizes
- Improved touch targets for better usability on smaller screens

### 🔧 Technical Improvements
- Removed unused color variables (deep rose, dark brown from primary usage)
- Optimized CSS specificity and inheritance
- Cleaned up component structure for better maintainability

### 📝 Notes
- ESLint warnings for unused variables are non-critical and do not affect functionality
- All changes tested on localhost:5175 before deployment
