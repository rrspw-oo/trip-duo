# Isamu Noguchi & Mitsuru Senda Design System
## 野口勇 × 仙田満 設計系統

This design system is inspired by two Japanese masters of organic, sculptural, and playful design.

---

## Design Philosophy

### Isamu Noguchi (野口勇) Influence
- **Organic Forms**: Flowing, natural shapes with gentle curves
- **Sculptural Shadows**: Soft, layered shadows that create depth
- **Space & Balance**: Generous whitespace and harmonious proportions
- **Natural Materials**: Warm, earthy color palette inspired by stone, wood, and clay

### Mitsuru Senda (仙田満) Influence
- **Playful Interactions**: Delightful micro-animations and hover effects
- **Warm Colors**: Friendly, inviting palette that feels approachable
- **Rounded Shapes**: Generous border-radius on all elements
- **Joyful Experience**: Interactive elements that reward user actions

---

## Color Palette

### Primary Colors
```css
--color-terra-cotta: #D4876D    /* Warm terra cotta - primary actions */
--color-warm-sand: #F4E4D4      /* Warm sand - backgrounds */
--color-sage-green: #A8B89F     /* Sage green - secondary accents */
--color-soft-coral: #F2A494     /* Soft coral - highlights */
```

### Supporting Colors
```css
--color-gentle-sky: #B8D8E8     /* Gentle sky blue - tertiary */
--color-warm-stone: #D9C6B0     /* Warm stone - surfaces */
--color-deep-earth: #8B6F5C     /* Deep earth - borders */
--color-soft-yellow: #F4D58D    /* Soft yellow - accents */
```

### Text Colors
```css
--text-primary: #5C4A3D         /* Deep warm brown */
--text-secondary: #8B6F5C       /* Medium earth tone */
--text-tertiary: #A89580        /* Light earth tone */
--text-accent: #D4876D          /* Terra cotta for emphasis */
```

---

## Typography

### Scale
- **4xl**: 3rem (48px) - Hero headings
- **3xl**: 2.375rem (38px) - Page titles
- **2xl**: 1.875rem (30px) - Section headings
- **xl**: 1.5rem (24px) - Card headings
- **lg**: 1.25rem (20px) - Subheadings
- **base**: 1.0625rem (17px) - Body text (slightly larger for readability)
- **sm**: 0.9375rem (15px) - Small text
- **xs**: 0.8125rem (13px) - Caption text

### Line Heights
- **tight**: 1.25 - Headings
- **normal**: 1.6 - Body text (generous for readability)
- **relaxed**: 1.75 - Long-form content

---

## Spacing System

Based on a generous 6px base unit for breathing room:

```css
--space-xs: 6px
--space-sm: 12px
--space-md: 20px
--space-lg: 32px
--space-xl: 48px
--space-2xl: 64px
--space-3xl: 96px
```

---

## Border Radius

Inspired by Senda's playful, rounded forms:

```css
--radius-sm: 8px       /* Small elements */
--radius-md: 14px      /* Input fields */
--radius-lg: 20px      /* Cards */
--radius-xl: 28px      /* Large cards */
--radius-2xl: 36px     /* Hero elements */
--radius-full: 9999px  /* Pills & circles */
```

Special organic radius for unique elements:
```css
--radius-organic: 18px 28px 22px 26px  /* Slightly asymmetric */
```

---

## Shadows

Soft, sculptural shadows inspired by Noguchi's work with light:

```css
--shadow-soft: 0 2px 8px rgba(139, 111, 92, 0.08),
               0 1px 3px rgba(139, 111, 92, 0.06)

--shadow-sm:   0 4px 12px rgba(139, 111, 92, 0.1),
               0 2px 6px rgba(139, 111, 92, 0.08)

--shadow-md:   0 8px 24px rgba(139, 111, 92, 0.12),
               0 4px 12px rgba(139, 111, 92, 0.1)

--shadow-lg:   0 16px 40px rgba(139, 111, 92, 0.15),
               0 8px 20px rgba(139, 111, 92, 0.12)

--shadow-xl:   0 24px 56px rgba(139, 111, 92, 0.18),
               0 12px 28px rgba(139, 111, 92, 0.14)
```

---

## Transitions

Smooth, organic animations:

```css
--transition-fast: 180ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 280ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 380ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-bounce: 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## Gradients

Subtle, natural gradients:

```css
--gradient-warm: linear-gradient(135deg, #F4E4D4 0%, #E8D9C8 100%)
--gradient-earth: linear-gradient(135deg, #D9C6B0 0%, #C9B299 100%)
--gradient-accent: linear-gradient(135deg, #F2A494 0%, #D4876D 100%)
```

---

## Component Patterns

### Buttons
- **Primary**: Gradient accent background, full rounded corners
- **Hover**: Lift effect (translateY -2px to -3px) with scale
- **Active**: Slight compress effect
- **Disabled**: Reduced opacity, no interactions

### Cards
- Large border radius (--radius-xl or --radius-2xl)
- Soft shadows that expand on hover
- Subtle border for definition
- Hover: Lift + scale effect

### Forms
- Generous padding (--space-md)
- Large border radius (--radius-lg)
- Focus state: Border color change + soft glow
- Placeholder: Reduced opacity for hierarchy

### Tabs
- Pill-shaped active state
- Soft background transitions
- Active indicator line at bottom
- Nested in rounded container

---

## Accessibility

- **Focus States**: 3px solid outline with offset
- **Color Contrast**: All text meets WCAG 2.1 AA standards
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Touch Targets**: Minimum 44x44px for interactive elements

---

## Implementation Files

### Core CSS
- `index.css` - Design system variables and base styles
- `noguchi-senda-theme.css` - Theme-specific component styles
- `Login.css` - Login page styles
- `PlanSelection.css` - Plan selection styles

### Integration
Theme is loaded in `App.js`:
```javascript
import "../styles/App.css";
import "../styles/noguchi-senda-theme.css";
```

---

## Design Principles

### 1. Organic Over Geometric
Prefer flowing curves to sharp angles. Even cards have generous rounded corners.

### 2. Warmth Over Coolness
Earthy, warm tones create an inviting, friendly atmosphere.

### 3. Playfulness Over Rigidity
Subtle animations and hover effects make interactions delightful.

### 4. Breathing Room Over Density
Generous spacing lets content breathe and reduces cognitive load.

### 5. Sculptural Depth Over Flatness
Layered shadows create depth and hierarchy without being heavy.

---

## Usage Guidelines

### DO ✓
- Use generous spacing between elements
- Add playful hover effects to interactive elements
- Keep corners rounded (minimum --radius-lg for cards)
- Use soft, natural shadows
- Include smooth transitions on state changes

### DON'T ✗
- Use sharp 90-degree corners
- Create dense, cramped layouts
- Use harsh, high-contrast shadows
- Add abrupt state changes without transitions
- Use cool, clinical colors

---

## Inspiration & References

- **Isamu Noguchi**: Sculptor, furniture designer, landscape architect
  - Known for: Noguchi Table, Akari lamps, play sculptures
  - Philosophy: "Everything is sculpture"

- **Mitsuru Senda**: Architect, playground designer
  - Known for: Playful children's spaces with organic forms
  - Philosophy: Creating joyful, engaging environments

---

## Version History

- **v1.0.0** (2025-10-11): Initial Noguchi-Senda inspired design system

---

*"The essence of sculpture is for me the perception of space, the continuum of our existence."* - Isamu Noguchi
