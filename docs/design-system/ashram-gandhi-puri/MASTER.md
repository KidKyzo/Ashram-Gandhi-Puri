# Ashram Gandhi Puri design system

The public site uses white space, system typography and the existing saffron and purple identity. Shared tokens live in src/styles/styles.css.

## Palette

| Role | Color | Usage |
| --- | --- | --- |
| Canvas | #FFFFFF | Main backgrounds, forms and navigation |
| Neutral surface | #FAFAFA | Section separation and footer |
| Text | #262626 | Headings and primary copy |
| Muted text | #626262 | Descriptions and captions |
| Saffron | #F1AD66 | Primary buttons and decorative accents |
| Saffron ink | #95521C | Accent text on light surfaces |
| Deep purple | #2E1065 | Text on saffron and focus rings |
| Lavender | #A78BFA | Decorative brand accents |
| Lavender surface | #F5F3F8 | Subtle panels and closing invitation |
| Divider | #E5E5E5 | Cards and section borders |
| Control border | #858585 | Visible input boundaries |

Use dark purple text on saffron buttons. White on saffron fails text contrast. Green and red communicate success and errors.

## Typography and layout

- Use the system sans-serif stack for headings and copy, with no font downloads.
- Body copy starts at 16px. Large titles use medium weight and tighter tracking.
- Use a 1200px container with 16–32px responsive side padding and 64–96px section spacing.
- Pair homepage copy with a standalone photograph. Inner-page headers use typography on white.
- Stack columns and wrap actions on mobile.

## Components

- Buttons: 6px radius, minimum 44px touch targets, solid saffron primary and neutral outlined secondary.
- Cards and images: 8px radius, thin borders, no decorative shapes or pronounced shadows.
- Footer: neutral light surface with the same readable forms and links as the rest of the site.
- Donation form and modal: shared CSS tokens through Tailwind arbitrary values; clear pending-verification status.
- Avoid gradients, photo scrims, oversized pills and moving cards on hover.

## Accessibility and verification

Maintain 4.5:1 ordinary text contrast and 3:1 visible control boundaries. Provide keyboard focus, semantic landmarks, meaningful image alternatives, a skip link and reduced motion support. Check mobile and desktop widths, long donation amounts, tables and navigation. Run lint, TypeScript and a production build before delivery.
