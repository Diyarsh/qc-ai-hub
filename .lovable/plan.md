
# Update Primary Colors: Sky Blue for Dark Mode, Blue for Light Mode

## Overview
Update the application's primary color scheme based on the provided color reference:
- **Dark mode**: Sky blue (#81A6FF) - a lighter, softer blue
- **Light mode**: Blue (#455DFF) - a deeper, more saturated blue

## Color Conversions

| Mode | HEX | HSL Values |
|------|-----|------------|
| Dark Mode (Sky Blue) | #81A6FF | 220 100% 75% |
| Light Mode (Blue) | #455DFF | 229 100% 64% |

## Changes Required

### File: `src/index.css`

**1. Update Dark Theme Primary Colors (`:root` section)**
- Change `--primary` from `211 70% 55%` to `220 100% 75%` (sky blue)
- Update `--ring` to match
- Update `--sidebar-primary` and `--sidebar-ring` to match

**2. Update Light Theme Primary Colors (`.light` section)**
- Change `--primary` from `223 67% 42%` to `229 100% 64%` (blue)
- Update `--ring` to match
- Update `--sidebar-ring` to match

**3. Update Card Glow Effects**
- Update the `rgba` values in `.card-glow:hover` and `@keyframes glow` to use the new blue colors for consistency

## Technical Details

The CSS uses HSL color format without the `hsl()` wrapper since they're used as CSS custom properties with `hsl(var(--primary))`. The values are specified as: `hue saturation% lightness%`

### Summary of Line Changes

| Line | Current Value | New Value |
|------|--------------|-----------|
| 23 | `--primary: 211 70% 55%` | `--primary: 220 100% 75%` |
| 42 | `--ring: 211 70% 55%` | `--ring: 220 100% 75%` |
| 53 | `--sidebar-primary: 211 70% 55%` | `--sidebar-primary: 220 100% 75%` |
| 58 | `--sidebar-ring: 211 70% 55%` | `--sidebar-ring: 220 100% 75%` |
| 72 | `--primary: 223 67% 42%` | `--primary: 229 100% 64%` |
| 89 | `--ring: 223 67% 42%` | `--ring: 229 100% 64%` |
| 98 | `--sidebar-ring: 217.2 91.2% 59.8%` | `--sidebar-ring: 229 100% 64%` |
