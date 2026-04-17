# Tech Stack

## Core
- **HTML5, CSS3, JavaScript** — Vanilla ES6+ (no frameworks)
- **localStorage** — client-side data persistence

## Testing
- **Vitest** — test runner (ESM-compatible)
- **fast-check** — property-based testing library

## Common Commands

```bash
npm test          # Run all tests once (vitest --run)
```

## Key Conventions
- Use `crypto.randomUUID()` for ID generation; fallback to `Date.now() + Math.random()` if unavailable
- All localStorage operations must be wrapped in try/catch — fail gracefully with an empty array
- Property-based tests require minimum 100 iterations per property
- Tag each property test with: `// Feature: todolist-app, Property {N}: {short description}`
