# Spline Watermark Removal

This directory contains a local Spline viewer that removes the "Built with Spline" watermark.

## Files

- `index.html` - Local Spline viewer with aggressive watermark removal
- `README.md` - This documentation file

## How it works

1. **Local iframe wrapper**: The scene is loaded in an iframe pointing to `/spline/index.html`
2. **Aggressive CSS hiding**: Multiple CSS selectors hide any watermark elements
3. **JavaScript removal**: Periodic removal of watermark elements from the DOM
4. **CORS handling**: Graceful handling of cross-origin restrictions

## Watermark removal methods

### CSS-based hiding
```css
.spline-watermark,
[class*="watermark"],
[class*="spline-brand"],
[id*="watermark"],
[id*="spline-brand"],
[class*="built-with"],
[id*="built-with"],
[class*="powered-by"],
[id*="powered-by"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}
```

### JavaScript-based removal
```javascript
const watermarkSelectors = [
    '.spline-watermark',
    '[class*="watermark"]',
    '[class*="spline-brand"]',
    // ... more selectors
];

watermarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.remove());
});
```

## Usage

The local viewer is automatically used by the `SplineWrapper` component and as a fallback in the `SplineScene` component when watermarks are detected.

## Notes

- The original Spline scene URL is still used, but wrapped in a local iframe
- This approach maintains the original 3D scene while removing branding
- CORS restrictions may prevent some watermark removal, but CSS hiding provides a fallback
