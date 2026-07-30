# Modern Design System

Comprehensive design system for the Fleet Manager application following modern design principles and best practices.

## 🎨 Design Philosophy

- **Clean & Minimal**: Removing unnecessary elements while maintaining clarity
- **Accessible**: WCAG 2.1 AA compliant color contrasts and interactions
- **Responsive**: Mobile-first design that scales beautifully
- **Performant**: GPU-accelerated animations and optimized rendering
- **Dark Mode**: Full support for light and dark themes

## 📐 Design Tokens

### Color Palette

#### Primary Colors
- **Primary**: `#6366f1` (Indigo) - Main brand color
- **Primary Light**: `#818cf8` - Hover states
- **Primary Dark**: `#4f46e5` - Active states

#### Semantic Colors
- **Success**: `#10b981` (Green) - Positive actions, completed states
- **Warning**: `#f59e0b` (Amber) - Caution, pending states
- **Danger**: `#ef4444` (Red) - Destructive, error states
- **Info**: `#0ea5e9` (Blue) - Informational content

#### Neutral Colors
```
50:   #f9fafb (lightest)
100:  #f3f4f6
200:  #e5e7eb
300:  #d1d5db
400:  #9ca3af
500:  #6b7280
600:  #4b5563
700:  #374151
800:  #1f2937
900:  #111827 (darkest)
```

### Typography

#### Font Family
- **Primary**: System stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Monospace**: Fira Code, Roboto Mono

#### Scale
- **H1**: 2.5rem / 800 weight / -0.02em letter spacing
- **H2**: 1.875rem / 700 weight
- **H3**: 1.5rem / 600 weight
- **H4**: 1.25rem / 600 weight
- **Body**: 1rem / 400 weight / 1.6 line height
- **Small**: 0.875rem / 400 weight

### Spacing System

```
xs:   0.25rem (4px)
sm:   0.5rem  (8px)
md:   1rem    (16px)
lg:   1.5rem  (24px)
xl:   2rem    (32px)
2xl:  3rem    (48px)
3xl:  4rem    (64px)
```

### Border Radius

```
xs:   0.25rem (4px)
sm:   0.375rem (6px)
md:   0.5rem (8px)
lg:   0.75rem (12px)
xl:   1rem (16px)
2xl:  1.5rem (24px)
```

### Shadows

```
xs:  0 1px 2px 0 rgba(0,0,0, 0.05)
sm:  0 1px 3px 0 rgba(0,0,0, 0.1), 0 1px 2px 0 rgba(0,0,0, 0.06)
md:  0 4px 6px -1px rgba(0,0,0, 0.1), 0 2px 4px -1px rgba(0,0,0, 0.06)
lg:  0 10px 15px -3px rgba(0,0,0, 0.1), 0 4px 6px -2px rgba(0,0,0, 0.05)
xl:  0 20px 25px -5px rgba(0,0,0, 0.1), 0 10px 10px -5px rgba(0,0,0, 0.04)
2xl: 0 25px 50px -12px rgba(0,0,0, 0.25)
```

### Transitions

```
fast:  150ms cubic-bezier(0.4, 0, 0.2, 1)
base:  200ms cubic-bezier(0.4, 0, 0.2, 1)
slow:  300ms cubic-bezier(0.4, 0, 0.2, 1)
```

## 🎯 Component Guidelines

### StatCard
- **Styling**: Glass morphism effect with gradient top border
- **Hover**: Elevates 4px with enhanced shadow
- **Icon**: 60x60px with gradient background
- **Color Coding**: Each variant has distinct color gradient
- **Animation**: Smooth scale and shadow transitions

### Dashboard
- **Header**: Large gradient title with icon badge and timestamp
- **Sections**: Organized into logical groups with section titles
- **Grid**: Responsive 3-column on desktop, 1-column on mobile
- **Animations**: Staggered slide-up animation for metrics

### Navigation
- **Navbar**: Sticky with glassmorphic effect
- **Logo**: Gradient text with emoji prefix
- **Links**: Animated underline on hover with smooth transition
- **Responsiveness**: Vertical stack on mobile with background highlights

## 🌓 Dark Mode

All components fully support dark mode through CSS custom properties:

```css
@media (prefers-color-scheme: dark) {
  /* Automatic theme switching */
}
```

Color adjustments:
- Background colors darken
- Text colors lighten
- Shadows become more pronounced
- Gradients preserve vibrancy

## 📱 Responsive Breakpoints

```
Mobile:  < 640px (single column, stacked)
Tablet:  640px - 1024px (2 columns)
Desktop: > 1024px (3+ columns, full layout)
```

## ✨ Visual Effects

### Animations

**Entrance**:
- Slide-up with fade: `0.6s cubic-bezier(0.4, 0, 0.2, 1)`
- Staggered effect on list items

**Interactions**:
- Hover scale: `translateY(-4px)`
- Underline draw: `scaleX` transform origin center
- Button ripple: smooth background transition

**Micro-interactions**:
- Link hover: color transition + underline
- Card hover: elevation + border highlight
- Input focus: border color + glow effect

### Gradients

**Primary**: `135deg, #6366f1 0%, #8b5cf6 100%`
**Success**: `135deg, #10b981 0%, #14b8a6 100%`
**Warning**: `135deg, #f59e0b 0%, #f97316 100%`
**Danger**: `135deg, #ef4444 0%, #ec4899 100%`

## 🔧 Usage

### Import Theme
```css
@import './styles/theme.css';
```

### Use Custom Properties
```css
.component {
  color: var(--text-primary);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}
```

### Apply Gradients
```css
.header {
  background: var(--gradient-primary);
}
```

## 🎨 Color Combinations

### Success State
- Background: `var(--success-50)`
- Text: `var(--success-dark)`
- Icon: `var(--success)`

### Warning State
- Background: `var(--warning-50)`
- Text: `var(--warning-dark)`
- Icon: `var(--warning)`

### Error State
- Background: `var(--danger-50)`
- Text: `var(--danger-dark)`
- Icon: `var(--danger)`

## 📋 Implementation Checklist

### Dashboard
- [x] Gradient title with icon
- [x] Section headers with colored left border
- [x] Responsive metric grid
- [x] Last updated timestamp
- [x] Slide-up animations
- [x] Dark mode support

### Navigation
- [x] Glassmorphic navbar
- [x] Gradient logo
- [x] Animated link underlines
- [x] Mobile responsive menu
- [x] Sticky positioning

### Cards
- [x] Gradient top border
- [x] Smooth hover elevation
- [x] Gradient icon backgrounds
- [x] Color-coded variants
- [x] Responsive sizing

## 🚀 Best Practices

1. **Always use CSS variables** - Makes theming and maintenance easier
2. **Prefer transitions over animations** - Better performance
3. **Use relative units** - Better for responsiveness
4. **Optimize shadows** - Use appropriate shadow levels
5. **Test dark mode** - Every component should look good in both themes
6. **Mobile-first design** - Build for small screens first
7. **Accessible colors** - Maintain WCAG AA contrast ratios
8. **Smooth interactions** - Use consistent timing and easing

## 📚 Resources

- Design tokens defined in: `src/styles/theme.css`
- Global styles in: `src/index.css`
- Component-specific styles in: `src/components/*/Component.module.css`

---

**Version**: 1.0
**Last Updated**: July 2026
