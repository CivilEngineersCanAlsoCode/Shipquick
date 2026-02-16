# Responsive Design Rules

## 1. Mobile-First Strategy

Always design for the smallest screen first, then progressively enhance for larger screens.

```css
/* Mobile first (default) */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
  }
}
```

## 2. Standard Breakpoints

| Breakpoint | Width         | Target       |
| ---------- | ------------- | ------------ |
| **xs**     | 0 - 479px     | Small phones |
| **sm**     | 480 - 767px   | Large phones |
| **md**     | 768 - 1023px  | Tablets      |
| **lg**     | 1024 - 1439px | Laptops      |
| **xl**     | 1440px+       | Desktops     |

## 3. Layout Rules

### Flexible Grid

- Use CSS Grid or Flexbox, never fixed-width layouts.
- Grid columns: 4 (mobile), 8 (tablet), 12 (desktop).
- Gutter: 16px (mobile), 24px (tablet/desktop).

### Fluid Typography

```css
/* Fluid type scale using clamp() */
h1 {
  font-size: clamp(1.75rem, 4vw, 3rem);
}
h2 {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}
body {
  font-size: clamp(1rem, 2vw, 1.125rem);
}
```

### Flexible Images

```css
img {
  max-width: 100%;
  height: auto;
}
```

## 4. Touch Target Rules

- **Minimum touch target**: 44x44px (WCAG) or 48x48px (Material Design).
- **Spacing between targets**: Minimum 8px.
- **No hover-only interactions**: Everything must work with tap.

## 5. Content Adaptation

| Screen Size | Navigation           | Content                | Actions            |
| ----------- | -------------------- | ---------------------- | ------------------ |
| Mobile      | Hamburger menu       | Single column, stacked | Bottom sheet / FAB |
| Tablet      | Side rail or top bar | 2-column when useful   | Inline buttons     |
| Desktop     | Full navigation bar  | Multi-column layout    | Toolbar actions    |

## 6. Performance Considerations

- **Lazy load images** below the fold.
- **Use `srcset`** for responsive images (serve appropriate sizes).
- **Minimize CSS/JS** for mobile (critical CSS inline, defer rest).
- **Test on real devices** (emulators miss real-world performance).

## 7. Anti-Patterns

| Don't                        | Do Instead                 |
| ---------------------------- | -------------------------- |
| Hide content on mobile       | Prioritize and restructure |
| Use tiny text (<14px)        | Minimum 16px base font     |
| Create separate mobile site  | Use responsive design      |
| Ignore landscape orientation | Test both orientations     |
