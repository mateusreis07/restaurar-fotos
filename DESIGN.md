```markdown
# Design System Specification: The Digital Heirloom

## 1. Overview & Creative North Star: "The Digital Heirloom"
This design system moves away from the cold, clinical nature of typical AI SaaS platforms. Our Creative North Star is **"The Digital Heirloom"**—an editorial-inspired framework that treats every user interaction like turning the page of a high-end photo book. 

To bridge the gap between "Nostalgic" and "High-Tech," we utilize **Soft Minimalism**. We break the standard "dashboard" look by using intentional asymmetry, generous white space (the "breathing room" of memory), and a sophisticated layering of surfaces that mimic fine-art paper and frosted glass. For our senior and non-technical audience, we prioritize clarity through massive typography and high-contrast touch points, ensuring the technology feels invisible while the emotion remains front and center.

---

## 2. Colors: Tonal Depth over Borders
Our palette avoids the "grid-box" look of 2010s web design. We use color to define space, not lines.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` (#f0f3ff) section should sit on a `surface` (#f9f9ff) background to create a "soft edge" without a hard stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following tiers to define importance:
- **Base Layer:** `surface` (#f9f9ff) – The canvas.
- **Sectioning:** `surface-container-low` (#f0f3ff) – Large content blocks.
- **Interactive Containers:** `surface-container-highest` (#dce2f3) – Elevated utility zones.
- **The "Glass & Gradient" Rule:** Floating elements (modals, popovers) must use `surface-container-lowest` (#ffffff) with a 80% opacity and a 20px `backdrop-blur`. This "Glassmorphism" ensures the UI feels premium and integrated.

### Signature Textures
Main CTAs and Hero sections must utilize a **Soft-Glow Gradient** transitioning from `primary` (#483ede) to `primary_container` (#625bf8) at a 135-degree angle. This adds "visual soul" and depth that a flat hex code cannot achieve.

---

## 3. Typography: The Editorial Voice
We use a high-contrast pairing of **Plus Jakarta Sans** for authority and **Inter** for functional clarity.

*   **Display (Plus Jakarta Sans):** Large, airy, and welcoming. `display-lg` (3.5rem) should be used for emotional hooks.
*   **Headlines (Plus Jakarta Sans):** Use `headline-lg` (2rem) for page titles to ensure legibility for seniors.
*   **Body & Titles (Inter):** `body-lg` (1rem) is our standard for all descriptions. Never go below `body-sm` (0.75rem) to maintain accessibility.

**Editorial Intent:** Use `display-md` for hero statements with a negative letter-spacing (-0.02em) to create a "signed" bespoke feel.

---

## 4. Elevation & Depth: Tonal Layering
We convey hierarchy through "stacks" rather than structural shadows.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a natural "lift" mimicking a photograph resting on a desk.
*   **Ambient Shadows:** If a shadow is required for a floating action, use a `24px blur` at `4% opacity` using the `on-surface` (#151c27) tint. It should look like a soft glow, not a dark drop-shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a container definition, use `outline-variant` (#c7c4d7) at **15% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components: Soft & Intentional

### Buttons
*   **Primary:** High-roundedness (`xl`: 3rem). Background: `primary` (#483ede). Text: `on_primary` (#ffffff). Include a subtle inner-glow for a 3D "pressable" feel.
*   **Secondary:** Background: `secondary_container` (#dbe3f0). No border. This acts as a "soft" alternative for secondary actions.

### Cards & Lists
*   **The "No-Divider" Rule:** Forbid the use of horizontal lines. Separate list items using `spacing-4` (1.4rem) of vertical white space or by alternating background tints (`surface` to `surface-container-low`).
*   **Corner Radius:** All cards must use `lg` (2rem) or `xl` (3rem) roundedness to feel safe and non-threatening.

### Photo Comparison Slider (App Specific)
*   **Handle:** Use `surface-container-lowest` with a heavy `backdrop-blur`. 
*   **Interaction:** Soft haptic feedback and large touch targets for older users.

### Input Fields
*   **Style:** Minimalist. Use `surface-container-highest` (#dce2f3) as the fill. 
*   **Focus State:** Shift the background to `primary_fixed` (#e2dfff) rather than adding a thick border.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place a "Before" photo slightly offset from an "After" photo to create visual interest.
*   **Exaggerate White Space:** If in doubt, add more padding. Our audience needs "room to breathe."
*   **Use Tonal Transitions:** Use `surface-dim` to define the footer area instead of a line.

### Don’t:
*   **Don't use "Pure Black":** Use `on_surface` (#151c27) for text to keep the nostalgia "soft."
*   **Don't use 1px Borders:** It breaks the "Heirloom" feel and creates visual noise for seniors.
*   **Don't use Sharp Corners:** Nothing in this system should have a radius smaller than `sm` (0.5rem). Hard edges feel "technical" and "unforgiving."
*   **Don't Overcomplicate Navigation:** Use a single, clear "primary" path. Multi-level dropdowns are strictly prohibited.