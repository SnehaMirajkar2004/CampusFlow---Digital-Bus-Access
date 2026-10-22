---
name: Lumina Academic
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e7f2'
  surface-container-highest: '#e1e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f9f9ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ec'
typography:
  h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-page: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
This design system is anchored in the intersection of academic rigor and modern SaaS efficiency. It prioritizes clarity, intellectual focus, and a sense of "digital calm." The aesthetic follows a **Glassmorphic Minimalism** approach—utilizing the depth of layered transparency and soft focus to organize complex information without visual clutter.

The brand personality is authoritative yet accessible. It avoids the coldness of traditional institutional design in favor of a vibrant, forward-thinking palette. By using generous whitespace and high-quality "glass" surfaces, the system evokes a feeling of limitless potential and organized thought, perfect for researchers, educators, and high-performance students.

## Colors
The palette is rooted in a professional "Academic Cool" spectrum. 

- **Primary Gradient:** A sophisticated transition from #3B82F6 (Action Blue) to #8B5CF6 (Intellectual Purple) is used for high-impact elements like primary buttons, progress indicators, and active states.
- **Surfaces:** Pure White (#FFFFFF) is the base for all primary content areas, while Very Light Gray (#F8FAFC) is used for secondary backgrounds and structural grouping to provide subtle contrast.
- **Typography:** We use a Slate Gray scale rather than pure black to maintain softness. #1E293B is reserved for semantic headings, while #475569 provides a highly readable experience for long-form academic text.
- **Accents:** Sky Blue (#60A5FA) acts as a supportive highlight for informational callouts and soft interactive states.

## Typography
This design system utilizes **Inter** for all typographic needs to ensure maximum legibility across dense data sets and long-form reading. 

The type scale is intentionally generous. **Line heights** for body text are set to 1.6x-1.7x to prevent cognitive fatigue during extended research or writing sessions. Headings use a tighter tracking and heavier weights to provide a clear structural hierarchy against the airy background surfaces. All labels and functional text use Medium (500) weights to ensure they remain distinct even at smaller sizes.

## Layout & Spacing
The layout philosophy is based on a **Fixed-Fluid Hybrid Grid**. Content is housed within a maximum 1280px container to maintain optimal line lengths for reading, while margins expand fluidly on ultra-wide displays.

We employ an 8px rhythmic scale. Spacing is intentionally "oversized" to enhance the feeling of luxury and focus. Component internal padding should rarely fall below 16px, and section vertical spacing (stacks) should lean towards the larger end of the scale (48px+) to allow the design to "breathe." This openness is critical in an academic context where information density is naturally high.

## Elevation & Depth
Depth in this design system is achieved through **Glassmorphism** and **Ambient Depth**.

1.  **Glass Surfaces:** Primary containers (cards, modals, sidebars) use a semi-transparent white background (80-90% opacity) with a `20px` to `40px` backdrop-blur. This allows the primary brand gradients or background elements to subtly peek through, creating a layered, lightweight feel.
2.  **Shadows:** We avoid harsh, dark shadows. Instead, use "Deep & Soft" shadows: a combination of a very large blur radius (30px+) and very low opacity (4-8%). The shadow color should be slightly tinted with the primary blue (#3B82F6) rather than pure black to maintain the system's vibrance.
3.  **Outlines:** Elements use a 1px solid border with a very low opacity (10% White or Slate) to define edges on light backgrounds without adding visual weight.

## Shapes
The shape language is consistently soft and approachable. The base corner radius is **16px (1rem)**, which applies to all standard cards, input fields, and containers. 

Buttons and high-frequency interactive chips use **Pill-shaping (full rounding)** to differentiate them from structural content. This contrast between the large-radius rectangular containers and fully rounded interactive elements guides the user's eye toward points of action. Smaller elements, like checkboxes, follow the `rounded-md` (8px) standard.

## Components
- **Buttons:** Primary buttons feature the Blue-to-Purple gradient with white text and a soft shadow. Secondary buttons use a glass effect (white semi-transparent) with a primary-colored border.
- **Glass Cards:** The signature component of the system. They must include a `backdrop-filter: blur(20px)`, a `1px` white border at 20% opacity, and a 16px corner radius.
- **Inputs:** Fields are clean, using the #F8FAFC background. Upon focus, the border transitions to a 2px Sky Blue (#60A5FA) stroke with a subtle outer glow.
- **Chips & Tags:** Small, fully rounded (pill) elements. Use high-contrast versions (Gradient background/White text) for primary categories and low-contrast versions (Light Blue background/Primary text) for secondary metadata.
- **Academic Lists:** Lists should feature generous vertical padding (16px+) and subtle dividers (#F1F5F9). Interaction states for list items should use a very faint Blue tint (#EFF6FF) rather than a gray scale.
- **Navigation:** The sidebar or top-nav should use the glassmorphism effect to stay present but unobtrusive, allowing the main content to remain the focus.