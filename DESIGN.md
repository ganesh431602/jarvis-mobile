# JARVIS Design System

## Direction

JARVIS follows a **Quiet Luxury AI OS** direction: a deep charcoal/near-black foundation, off-white typography, restrained accent, thin borders, subtle surfaces, generous spacing, restrained rounded corners, minimal icons, realistic data density, professional charts/tables, calm motion, and accessible contrast.

The current Vercel Dashboard redesign is a reference for interaction quality, information hierarchy, spacing, navigation patterns, and professional dashboard behavior only. Do not copy Vercel branding, logo, proprietary colors, exact layouts, wording, or proprietary components. AI should feel like functionality, not decoration.

Avoid cyberpunk styling, neon everywhere, excessive gradients/glassmorphism, floating AI orbs, robot graphics, generic SaaS templates, excessive rounded cards, and decorative “AI powered” labels.

## Typography

Use an existing project font if one is established; otherwise use a professional system/web-safe stack such as `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Define tokens for display, page title, section heading, body, metadata, labels, numbers, and tables. Numbers should use stable tabular figures where comparison matters. Hierarchy must come from size, weight, spacing, and contrast—not decoration.

## Semantic color tokens

Use semantic tokens rather than component-level hardcoded colors:

| Token | Meaning |
|---|---|
| `background` | App foundation |
| `surface` | Primary panel |
| `surface-elevated` | Modal/popover/emphasized panel |
| `border` | Dividers and control edges |
| `text-primary` | Main content |
| `text-secondary` | Supporting content |
| `text-muted` | Metadata and disabled context |
| `accent` | Focus and primary action |
| `success` / `warning` / `danger` / `info` | Semantic states |

Dark mode must retain readable contrast and must not rely on color alone.

## Layout and motion

- Use an 8px spacing system.
- Prefer restrained radius values: small control radius, medium panel radius, and avoid pill-shaped everything.
- Use 150–250ms transitions for micro-interactions.
- Avoid excessive animation and respect `prefers-reduced-motion`.

## Component behavior

- **Buttons:** clear hierarchy, disabled/loading states, keyboard support, and explicit destructive confirmation.
- **Inputs:** labels, validation, help text, error state, and visible focus.
- **Cards:** meaningful grouping; do not turn every fact into a card.
- **Tables:** aligned columns, responsive prioritization, empty/loading/error states, and accessible headers.
- **Badges:** semantic, concise, and not the sole status signal.
- **Navigation:** predictable active state, mobile bottom navigation where appropriate, desktop persistent navigation.
- **Modals/drawers:** focus trap, escape behavior, clear close action, and destructive confirmation.
- **Alerts:** distinguish warning, error, and informational unavailable states.
- **Skeletons:** match real content shape; never imply data exists.
- **Empty/unavailable/error states:** follow the state rules in `RULES.md`.
- **Confirmation dialogs:** summarize action, resource, risk, parameters, and approval requirement before commit.

## Responsive behavior

**Mobile:** bottom navigation where appropriate, touch-friendly controls, compact hierarchy, prioritized content, and safe overflow. **Desktop:** persistent navigation, denser operational views, and multi-column layouts where useful. Desktop must not simply stretch the mobile layout.

## Accessibility

Provide keyboard navigation, visible focus, sufficient contrast, semantic HTML, screen-reader labels, touch targets of at least 44×44 CSS pixels where practical, and reduced-motion support. Never encode meaning by color alone.
