# Accessibility Checklist (WCAG 2.1 AA)

## Purpose

Ensure all digital products meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, making them usable by people with disabilities.

## 1. Perceivable

### 1.1 Text Alternatives

- [ ] All images have meaningful `alt` text (not "image" or "photo").
- [ ] Decorative images use `alt=""` or CSS backgrounds.
- [ ] Complex images (charts, diagrams) have long descriptions.

### 1.2 Time-Based Media

- [ ] Videos have captions (synchronized).
- [ ] Audio content has transcripts.
- [ ] No auto-playing media without user control.

### 1.3 Adaptable

- [ ] Content structure uses semantic HTML (`<h1>`, `<nav>`, `<main>`).
- [ ] Reading order is logical when CSS is disabled.
- [ ] Form fields have associated `<label>` elements.

### 1.4 Distinguishable

- [ ] Text color contrast ratio ≥ 4.5:1 (normal text).
- [ ] Large text contrast ratio ≥ 3:1.
- [ ] UI component contrast ratio ≥ 3:1.
- [ ] Text can be resized to 200% without loss of functionality.
- [ ] No content requires horizontal scrolling at 320px width.

## 2. Operable

### 2.1 Keyboard Accessible

- [ ] All functionality is accessible via keyboard.
- [ ] No keyboard traps (user can always tab out).
- [ ] Focus order is logical and intuitive.
- [ ] Focus indicator is visible (not hidden by CSS).

### 2.2 Enough Time

- [ ] Users can extend, adjust, or turn off time limits.
- [ ] Auto-updating content can be paused or stopped.

### 2.3 Seizures & Physical Reactions

- [ ] No content flashes more than 3 times per second.

### 2.4 Navigable

- [ ] Pages have descriptive `<title>` elements.
- [ ] Skip navigation link is available.
- [ ] Link text is descriptive (not "click here").
- [ ] Multiple ways to find pages (search, sitemap, navigation).

## 3. Understandable

### 3.1 Readable

- [ ] Page language is declared (`<html lang="en">`).
- [ ] Abbreviations are expanded on first use.

### 3.2 Predictable

- [ ] Navigation is consistent across pages.
- [ ] Components behave predictably (no unexpected changes).

### 3.3 Input Assistance

- [ ] Error messages identify the field and describe the error.
- [ ] Required fields are clearly indicated.
- [ ] Suggestions are provided for correcting errors.

## 4. Robust

### 4.1 Compatible

- [ ] HTML validates without significant errors.
- [ ] ARIA attributes are used correctly (roles, states, properties).
- [ ] Custom components have appropriate ARIA labels.

## 5. Testing Tools

- **axe DevTools**: Browser extension for automated checks.
- **WAVE**: Web accessibility evaluation tool.
- **Lighthouse**: Built-in Chrome audit.
- **Screen Reader Testing**: NVDA (Windows), VoiceOver (Mac), TalkBack (Android).
