# Theme System Implementation

## Overview

WinMorphus now includes a complete light/dark theme system using CSS variables and React Context.

## Usage

### 1. Using the Theme Hook

```jsx
import { useTheme } from "../Context/UseTheme";

const MyComponent = () => {
  const { theme, toggleTheme, isDark, setSpecificTheme } = useTheme();

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

### 2. Available CSS Variables

#### Background Colors

- `--bg-primary` - Main background
- `--bg-secondary` - Secondary background
- `--bg-tertiary` - Tertiary background
- `--bg-card` - Card backgrounds
- `--bg-card-gradient-start` - Gradient start
- `--bg-card-gradient-end` - Gradient end

#### Text Colors

- `--text-primary` - Primary text
- `--text-secondary` - Secondary text
- `--text-tertiary` - Tertiary text
- `--text-muted` - Muted text

#### Border Colors

- `--border-primary` - Primary borders
- `--border-secondary` - Secondary borders
- `--border-accent` - Accent borders

#### Accent Colors

- `--accent-primary` - Primary accent (yellow)
- `--accent-secondary` - Secondary accent
- `--accent-hover` - Hover state

#### Status Colors

- `--status-success` - Success green
- `--status-error` - Error red
- `--status-warning` - Warning orange
- `--status-info` - Info blue

#### Component Specific

- `--navbar-bg` - Navbar background
- `--navbar-border` - Navbar border
- `--input-bg` - Input background
- `--input-border` - Input border
- `--scrollbar-track` - Scrollbar track
- `--scrollbar-thumb` - Scrollbar thumb
- `--scrollbar-thumb-hover` - Scrollbar thumb hover

### 3. Tailwind Integration

Use CSS variables with Tailwind arbitrary values:

```jsx
// Background
<div className="bg-[var(--bg-primary)]">

// Text
<p className="text-[var(--text-primary)]">

// Border
<div className="border-[var(--border-primary)]">

// Hover states
<button className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)]">
```

### 4. Theme Toggle Button

The theme toggle is in the navbar (MainNavbar.jsx):

```jsx
<button onClick={toggleTheme}>{isDark ? <Sun /> : <Moon />}</button>
```

### 5. Converting Existing Components

**Before:**

```jsx
<div className="bg-slate-900 text-white border-slate-800">
```

**After:**

```jsx
<div className="bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)]">
```

## Theme Values

### Light Theme

- Primary BG: `#ffffff`
- Primary Text: `#0f172a`
- Accent: `#eab308` (yellow-500)

### Dark Theme

- Primary BG: `#0f172a`
- Primary Text: `#f8fafc`
- Accent: `#facc15` (yellow-400)

## Architecture

### Files Added

- `src/Context/ThemeContext.jsx` - Theme context provider
- `src/Context/UseTheme.js` - Custom hook for theme
- Updated `src/index.css` - CSS variables definition
- Updated `src/main.jsx` - Wrapped app with ThemeProvider
- Updated `src/Component/MainNavbar.jsx` - Added theme toggle button

### How It Works

1. Theme preference saved in localStorage (`theme` key)
2. `data-theme` attribute set on `<html>` element
3. CSS variables change based on `data-theme` value
4. Components use CSS variables via Tailwind arbitrary values
5. Theme persists across page refreshes

## Best Practices

1. **Always use CSS variables** for colors that should change with theme
2. **Keep hard-coded colors** only for brand-specific elements that don't change
3. **Test both themes** when creating new components
4. **Use semantic variable names** (e.g., `--text-primary` not `--gray-900`)
5. **Maintain consistency** - use the same variable for similar elements

## Migration Checklist

When converting a component to theme-aware:

- [ ] Replace `bg-slate-X` with `bg-[var(--bg-X)]`
- [ ] Replace `text-white/gray` with `text-[var(--text-X)]`
- [ ] Replace `border-slate-X` with `border-[var(--border-X)]`
- [ ] Replace `text-yellow-400` with `text-[var(--accent-primary)]`
- [ ] Test component in both light and dark modes
- [ ] Check hover/focus states work correctly
