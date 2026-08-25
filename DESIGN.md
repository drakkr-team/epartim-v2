# Epartim Design System

This document codifies the visual language already implemented by `@workspace/ui-theme`,
`@workspace/ui-react`, and the client/admin applications. New UI should compose those
primitives rather than introduce app-specific colors or typography.

## 1. Atmosphere & Identity

Epartim is a restrained operational product: high-contrast neutral work surfaces, a
secondary-colored navigation shell, and primary-colored emphasis for the current task.
Admin screens prioritize scanability, explicit state, and dense-but-readable information.

## 2. Color

### Palette

- `neutral-1` through `neutral-12`: page, card, border, muted text, and primary text ramps.
- `primary-1` through `primary-12`: focus, selection, links, and primary actions.
- `secondary-1` through `secondary-12`: persistent navigation and supporting emphasis.
- `success`, `warning`, `error`, and `info` ramps: semantic feedback only.

The source of truth is `packages/ui/theme/src/tokens.ts`; raw color values do not belong in
application components.

### Rules

- Use `neutral-1` for the main work surface and `neutral-3` for subdued regions.
- Use semantic ramps for status and feedback; never encode status with color alone.
- Destructive controls use the shared destructive button treatment and explicit copy.

## 3. Typography

### Scale

Use Tailwind's shared type scale. Page titles use `text-3xl` to `text-4xl`, section titles
use `text-lg` to `text-xl`, body copy uses `text-sm` to `text-base`, and metadata uses
`text-xs` to `text-sm`.

### Font Stack

The shared sans stack from `@workspace/ui-theme` is the default. Existing application font
loading remains authoritative.

### Rules

- Keep page titles bold and task-oriented.
- Use sentence case for labels and actions.
- Use tabular numerals for pagination and dates where alignment benefits.

## 4. Spacing & Layout

### Base Unit

Use the existing Tailwind spacing scale, centered on 4 px increments.

### Grid

- The admin sidebar owns persistent navigation; the main content region owns vertical scroll.
- Page content is a vertical stack with a responsive header cluster, filters, state region,
  data surface, and wrapping pagination controls.
- Forms use a single column on narrow screens and preserve full keyboard access.

### Rules

- Use the StyleGallery `stack` pattern for page rhythm:
  https://github.com/changeroa/StyleGallery/blob/main/patterns/stacking/stack.md
- Use the StyleGallery `pagination` pattern for bounded, wrapping controls:
  https://github.com/changeroa/StyleGallery/blob/main/patterns/in-line-grouping/pagination.md
- Avoid nested vertical scrolling inside tables; horizontal overflow belongs to `Table`.

## 5. Components

### Page Header

An eyebrow, title, optional description, and a wrapping action cluster. Actions remain after
the title in source order.

### Data Table

Use `@workspace/ui-react/components/table`. Rows expose a clear detail link; actions are
explicit controls and appear only when API metadata grants permission.

Required states: loading skeleton, empty collection, no search results, network/error state,
and populated rows.

### Form Page

Create and edit operations use dedicated routes with `Card` and `Field`-backed TanStack Form
inputs. The page title and description identify the operation; submit controls expose pending
state and prevent duplicate submission.

Required states: pristine, local validation, pending, API validation error, and success.

### Destructive Confirmation

Use `AlertDialog`. Name and email identify the target, permanent impact is stated in text,
and cancel remains available after an API failure.

### Status Badge

Pair a semantic color treatment with the visible French labels `Activé` or `En attente`.

## 6. Motion & Interaction

### Timing

Use the transitions built into shared primitives. Do not add decorative motion to CRUD
surfaces.

### Rules

- Preserve visible focus styles and logical source order.
- Disable repeated mutation controls while a request is pending.
- Loading, success, and error transitions must also be announced through text or toast.

## 7. Depth & Surface

### Strategy

Use `Card`, `Table`, `Dialog`, and `AlertDialog` surface treatments from `@workspace/ui-react`.
Their borders, shadows, overlays, and dark-mode behavior are authoritative.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Every field has a visible label and associated error message.
- Interactive table content is a real link or button, never a click-only row.
- Dialog focus trapping, escape behavior, and focus return come from Base UI primitives.
- Empty, loading, and error states are readable by assistive technology.
- Status and permissions are never conveyed by color alone.

### Accepted Debt

- The mobile admin navigation is intentionally a compact horizontal strip rather than the
  desktop sidebar; future navigation growth may require a dedicated drawer pattern.
