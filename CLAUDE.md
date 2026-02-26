# CLAUDE.md

## Package Manager

Always use `bun` instead of `npm`, `yarn`, or `pnpm` for all operations (install, run, build, etc.).

## Architecture Principles

### Reuse before creating

Always check for existing shared hooks, helpers, and components before writing new code. Build on top of what already exists:

- **Shape interaction hooks** — `lib/useShapeInteraction.ts` exports `useShapeHover` (browse-only hover/press tracking) and `useFocusOnEdit` (auto-focus on edit). Use these in any new shape that needs hover effects or inline editing.
- **Link detection** — Always use `isNavigable(shape)` from `lib/canvasMeta.ts` to check if a shape has a link. Never check `shape.meta.href` inline.
- **Layout helpers** — `lib/layoutHelpers.ts` exports `CANVAS_W`, `LEFT_PAD`, `centerCamera`, and `createBackButton`. Use these in all layout creators instead of duplicating constants or boilerplate.

### Component decomposition

When building or modifying features, keep components small and focused. Extract shared logic into hooks (`lib/`) and shared UI into components (`components/`). If you find yourself copying code between shape utils or layout creators, extract it into a shared module first.
