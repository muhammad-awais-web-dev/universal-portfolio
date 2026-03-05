# Testimonials: Carousel + Truncation + Popup Plan

## Problem
- Long testimonial comments fill cards unevenly and hurt readability
- Grid layout with many testimonials feels cluttered
- No way to read the full comment without leaving the page

## Proposed Changes

### Behaviour Rules
- **≤ 3 testimonials** → keep current 3-column grid (no carousel needed)
- **> 3 testimonials** → single horizontal row carousel with sliding animation
- **Comments** → truncated at **220 characters** with a "Read more" link
- **"Read more"** → opens a centred modal/popup with the full testimonial

---

## Files to Change

### 1. `components/portfolio/published-portfolio.tsx`
- Replace the inline testimonials `<div className="grid ...">` block (lines 210–234) with `<TestimonialsSection testimonials={testimonials} />`
- No other changes needed here (file stays a Server Component)

### 2. NEW `components/portfolio/testimonials-section.tsx` *(create)*
A `'use client'` component that owns all interactivity:

**Truncation logic**
```tsx
const MAX_LEN = 220
const truncate = (text: string) =>
  text.length > MAX_LEN ? text.slice(0, MAX_LEN).trimEnd() + '…' : text
```

**Layout logic**
```tsx
// ≤ 3 items  →  3-col grid  (identical to current markup)
// > 3 items  →  carousel row
```

**Carousel implementation** (no extra library — pure CSS + JS):
- `overflow-hidden` container with a `flex` inner track
- Each card is `min-w-[320px]` (or `w-[calc(33%_-_gap)]` on wide screens)
- `transform: translateX(...)` updated via `useState` + CSS `transition`
- Prev / Next arrow buttons (`ChevronLeft` / `ChevronRight` from lucide-react)
- Optional dot indicators below the row

**Modal/popup**
- Triggered by "Read more" button on any card
- State: `selectedTestimonial: Testimonial | null`
- Overlay: `fixed inset-0 bg-black/60 z-50 flex items-center justify-center`
- Panel: `bg-card rounded-xl p-6 max-w-lg w-full mx-4 relative`
- Close: ✕ button top-right + click-outside + `Escape` key
- Full comment shown with no truncation, author info at bottom (same card footer)

---

## Component API

```tsx
// published-portfolio.tsx  (server)
<TestimonialsSection testimonials={testimonials} />

// testimonials-section.tsx  (client)
interface Props { testimonials: Testimonial[] }
```

---

## Implementation Steps

1. Create `components/portfolio/testimonials-section.tsx` with:
   - Truncation helper
   - Conditional grid vs carousel layout
   - Carousel state (`currentIndex`, `prev()`, `next()`)
   - Modal state + overlay
   - `useEffect` for `Escape` key listener

2. Edit `components/portfolio/published-portfolio.tsx`:
   - Add import for `TestimonialsSection`
   - Replace the `<div className="grid ...">` block with `<TestimonialsSection testimonials={testimonials} />`
   - Keep the wrapping `<section>` and heading in the server component

---

## Notes
- No new npm packages required — uses existing Tailwind + lucide-react
- Modal pattern matches existing modals in the project (`fixed inset-0 bg-black/50`)
- Carousel arrows hidden / shown with `disabled` state at first/last position (or loop behaviour TBD)
