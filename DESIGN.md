# JARVIS Design System

## Direction

JARVIS is a **Quiet Luxury AI OS**. The current Vercel Dashboard redesign is a reference for interaction quality, hierarchy, spacing, navigation, and professional dashboard behavior only. Do not copy Vercel branding, colors, wording, layouts, or proprietary components.

Use a deep charcoal/near-black base, off-white typography, one restrained accent, thin borders, soft surfaces, generous spacing, restrained rounded cards, minimal icons, realistic information density, and professional charts/tables. Avoid cyberpunk, neon, robot graphics, excessive gradients/glass, floating AI orbs, and decorative AI labels. AI is functionality, not decoration.

## Tokens and layout

- Use an 8px spacing system.
- Define semantic background, surface, elevated-surface, border, primary/secondary/muted text, accent, success, warning, danger, and info tokens.
- Prefer an established project font; otherwise use a system/web-safe stack such as `Inter, ui-sans-serif, system-ui, sans-serif`.
- Use restrained radius values rather than pill-shaped everything.
- Use 150–250ms micro-interactions; respect `prefers-reduced-motion`.

## Components and states

Buttons, inputs, cards, tables, badges, navigation, modals, drawers, alerts, skeletons, empty states, unavailable states, errors, disabled, focus, pressed, and hover states must be intentional and accessible. Confirmation dialogs summarize action, target, risk, parameters, and approval requirement. Skeletons match real content and never imply fake data.

Every async view distinguishes LOADING, EMPTY, UNAVAILABLE, ERROR, and loaded states. Preserve loaded data when a refresh fails.

## Responsive behavior

Mobile uses touch-friendly controls, compact hierarchy, and bottom navigation where appropriate. Desktop uses persistent navigation, denser operational views, and multi-column layouts where useful. Desktop must not simply stretch mobile.

## Accessibility

Use semantic HTML, keyboard navigation, visible focus, screen-reader labels, sufficient contrast, status text not conveyed by color alone, and practical 44px touch targets. Destructive actions require clear confirmation.

## Future voice UI

Voice UI should expose listening, processing, speaking, interruption, permission, network, and approval states without decorative anthropomorphism. Show transcript and action proposal clearly; never hide consequential intent behind voice-only interaction.
