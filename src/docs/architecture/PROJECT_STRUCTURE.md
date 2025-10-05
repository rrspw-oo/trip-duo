#  Project Structure & Organization

Complete overview of the Travel PWA project organization.

---

##  Directory Structure

```
travel-pwa/

  src/                          # Source code
    App.js                      # Main application (optimized)
    App.css                     # Main styles
    Login.js                    # Authentication UI
    Login.css                   # Login styles
    PlanSelection.js            # Plan selection screen
    PlanSelection.css           # Plan selection styles
    AuthContext.js              # Authentication state management
    ErrorBoundary.js            # Error recovery component
    firebase.js                 # Firebase configuration
    index.js                    # App entry point
    index.css                   # Global styles
    reportWebVitals.js          # Performance monitoring
    serviceWorkerRegistration.js # PWA service worker
    service-worker.js           # Custom service worker
    setupTests.js               # Test configuration

  public/                       # Static assets
    index.html                  # HTML template
    manifest.json               # PWA manifest
    energy-fire-dynamic-force.svg # Logo/illustration
    favicon.ico                 # Favicon
    logo192.png                 # PWA icon (192x192)
    logo512.png                 # PWA icon (512x512)
    robots.txt                  # SEO robots file

  docs/                         #  Documentation
    README.md                   # Documentation index
    PROJECT_STRUCTURE.md        # This file
    architect-plan.md           # Original architecture plan
    SECURITY_FIXES_SUMMARY.md   # Security improvements
    PERFORMANCE_OPTIMIZATION_SUMMARY.md # Performance guide
    DEPLOYMENT_READY_CHECKLIST.md # Deployment steps
    FIREBASE_SECURITY_RULES.md  # Security rules docs
     assets/                  # Documentation assets
        colourTheme.png         # Color scheme reference

  build/                        # Production build (generated)
    index.html                  # Built HTML
    static/                     # Optimized assets
       css/                    # Minified CSS
       js/                     # Minified JS bundles
    manifest.json               # Built manifest
    service-worker.js           # Built service worker
    asset-manifest.json         # Asset mapping

  node_modules/                 # Dependencies (auto-generated)

  Configuration Files
    package.json                # NPM dependencies & scripts
    package-lock.json           # Locked dependencies
    .env                        # Environment variables (SECRET!)
    .gitignore                  # Git ignore rules
    firebase.json               # Firebase configuration
    .firebaserc                 # Firebase project config
    database.rules.json         # Firebase security rules
    README.md                   # Main project README

  .claude/                      # Claude Code settings (optional)
     settings.local.json         # Local Claude settings
```

---

##  Documentation Organization

All documentation is centralized in the `/docs` folder:

### Core Documentation
1. **README.md** - Documentation hub with links to all guides
2. **PROJECT_STRUCTURE.md** - This file (project organization)
3. **architect-plan.md** - Original architecture and design decisions

### Technical Guides
4. **SECURITY_FIXES_SUMMARY.md** - All security improvements
5. **PERFORMANCE_OPTIMIZATION_SUMMARY.md** - Performance optimizations
6. **FIREBASE_SECURITY_RULES.md** - Database security rules

### Deployment
7. **DEPLOYMENT_READY_CHECKLIST.md** - Complete deployment guide

### Assets
8. **/assets** - Images and design resources

---

##  Key Files Explained

### Source Code (`/src`)

#### **App.js** (Main Application)
- **Purpose**: Core application logic and UI
- **Optimizations**:
  - React.memo on Tab components
  - useMemo for expensive calculations
  - Debounced Firebase updates
  - useRef to prevent infinite loops
- **Size**: ~1,500 lines
- **Features**: 4 tabs (Dates, Flights, Itinerary, Essentials)

#### **Login.js** (Authentication)
- **Purpose**: Google Sign-In interface
- **Features**:
  - Google OAuth integration
  - Custom illustration
  - Responsive design
- **Size**: ~70 lines

#### **AuthContext.js** (State Management)
- **Purpose**: Global authentication state
- **Features**:
  - User session management
  - Login/logout functions
  - Loading states
- **Pattern**: React Context API

#### **ErrorBoundary.js** (Error Handling)
- **Purpose**: Graceful error recovery
- **Features**:
  - Catches React errors
  - User-friendly error messages
  - Reload functionality
  - Dev mode error details
- **Size**: ~80 lines

#### **firebase.js** (Backend Config)
- **Purpose**: Firebase initialization
- **Features**:
  - Environment variable configuration
  - Analytics setup (production only)
  - Auth and Database exports
- **Security**:  Uses env variables

---

### Configuration Files

#### **database.rules.json** (Security Rules)
```json
{
  "rules": {
    "travelPlans": { /* User-based access */ },
    "invites": { /* Invite code validation */ },
    "users": { /* User-specific data */ }
  }
}
```
- **Purpose**: Firebase Realtime Database security
- **Features**:
  - Row-level security
  - Ownership validation
  - Invite code expiration
  - Read/write permissions

#### **firebase.json** (Firebase Config)
```json
{
  "database": { "rules": "database.rules.json" },
  "hosting": { /* Hosting configuration */ }
}
```
- **Purpose**: Firebase deployment configuration
- **Features**:
  - Database rules path
  - Hosting settings
  - Cache control headers
  - SPA routing

#### **.env** (Environment Variables)
```env
REACT_APP_FIREBASE_API_KEY=***
REACT_APP_FIREBASE_AUTH_DOMAIN=***
# ... other Firebase config
```
- **Purpose**: Secret configuration
- **Security**:  In .gitignore
- **Usage**: Loaded by Create React App

#### **package.json** (NPM Config)
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "firebase": "^12.3.0",
    "dompurify": "^3.2.7",
    "lodash.debounce": "^4.0.8"
  }
}
```
- **Purpose**: Dependency management
- **Scripts**: start, build, test
- **Version**: 0.1.0

---

##  Asset Organization

### Public Assets (`/public`)
- **energy-fire-dynamic-force.svg** - Login page illustration
- **manifest.json** - PWA configuration
- **logo192.png** - App icon (small)
- **logo512.png** - App icon (large)
- **favicon.ico** - Browser tab icon

### Documentation Assets (`/docs/assets`)
- **colourTheme.png** - Color palette reference

---

##  Build Output (`/build`)

Generated by `npm run build`:

```
build/
 index.html              # Entry point
 static/
    css/
       main.[hash].css     # ~5 KB (gzipped)
    js/
        main.[hash].js      # ~158 KB (gzipped)
 service-worker.js       # Offline support
 manifest.json           # PWA config
 asset-manifest.json     # Asset mapping
```

### Bundle Analysis
- **Total Size**: ~163 KB (gzipped)
- **Breakdown**:
  - React + Firebase: ~120 KB
  - Application code: ~40 KB
  - CSS: ~5 KB

---

##  Security Organization

### Protected Files (in `.gitignore`)
```
.env                    #  Environment secrets
.env.local              #  Local overrides
node_modules/           #  Dependencies
build/                  #  Build artifacts
.firebase/              #  Firebase cache
```

### Security Components
1. **database.rules.json** - Database security
2. **ErrorBoundary.js** - Error containment
3. **DOMPurify** - XSS protection (in App.js)
4. **Firebase Auth** - User authentication

---

##  Optimization Organization

### Performance Files
- **App.js** - React.memo, useMemo optimizations
- **reportWebVitals.js** - Performance monitoring
- **service-worker.js** - Offline caching
- **firebase.js** - Debounced updates

### Monitoring Files
- **ErrorBoundary.js** - Error tracking
- **reportWebVitals.js** - Web Vitals
- **firebase.js** - Analytics setup

---

##  Code Organization Principles

### Component Structure
```javascript
// Standard component pattern
import React, { useState, useEffect } from 'react';

const Component = () => {
  // 1. Hooks
  const [state, setState] = useState();

  // 2. Effects
  useEffect(() => { ... }, []);

  // 3. Functions
  const handleAction = () => { ... };

  // 4. Render
  return ( ... );
};

export default Component;
```

### File Naming Conventions
- **Components**: PascalCase (`App.js`, `Login.js`)
- **Styles**: Match component (`App.css`, `Login.css`)
- **Utils**: camelCase (`firebase.js`)
- **Config**: kebab-case (`database.rules.json`)
- **Docs**: UPPER_CASE.md (`README.md`)

---

##  Best Practices Followed

### Code Organization
 Separation of concerns (components, styles, config)
 Consistent file naming
 Centralized documentation
 Environment-based configuration

### Security
 Secrets in environment variables
 Security rules in separate file
 .gitignore for sensitive files
 Input sanitization centralized

### Performance
 Optimizations in source files
 Production build optimization
 Asset organization for caching
 Service Worker for offline support

### Documentation
 All docs in `/docs` folder
 Comprehensive README files
 Code comments where needed
 Deployment guides

---

##  Workflow

### Development Workflow
```bash
1. npm start              # Start dev server
2. Edit source files      # Make changes
3. Browser auto-reloads   # See changes
4. Check console          # Performance metrics
```

### Deployment Workflow
```bash
1. npm run build          # Create production build
2. Test build locally     # Verify build works
3. firebase deploy        # Deploy to hosting
4. Verify live site       # Test production
```

### Documentation Workflow
```bash
1. Edit source code       # Make changes
2. Update relevant docs   # Document changes
3. Update README.md       # Update main docs
4. Commit changes         # Version control
```

---

##  Maintenance

### Adding New Features
1. Create component in `/src`
2. Add styles in matching `.css` file
3. Update `App.js` if needed
4. Document in `/docs`
5. Test thoroughly
6. Deploy

### Updating Dependencies
```bash
npm update              # Update packages
npm audit fix           # Fix vulnerabilities
npm run build           # Test build
```

### Security Updates
1. Run `npm audit`
2. Fix vulnerabilities
3. Update `database.rules.json` if needed
4. Deploy security rules
5. Document changes

---

##  Summary

**Well-Organized Project Structure:**
-  Clear separation of concerns
-  Comprehensive documentation
-  Security best practices
-  Performance optimizations
-  Easy to navigate
-  Production ready

**Total Files**: ~40 (excluding node_modules)
**Total Size**: ~200 KB (source)
**Build Size**: ~163 KB (gzipped)
**Documentation**: 7 markdown files

---

*Last Updated: October 2, 2025*
