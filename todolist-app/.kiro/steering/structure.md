# Project Structure

```
todolist-app/
├── index.html          # Main markup — form, task list, filter buttons
├── style.css           # All styling
├── src/
│   ├── app.js          # Entry point, event handlers, controller
│   ├── store.js        # In-memory state + all state mutations
│   ├── storage.js      # localStorage read/write abstraction
│   ├── render.js       # DOM rendering functions
│   └── validators.js   # Input validation helpers
└── tests/              # All test files (unit + property-based)
```

## Architecture

Simple MVC pattern — no build step, no bundler:

- **View**: `index.html` + `style.css` + render functions in `render.js`
- **Controller**: `app.js` — wires DOM events to state mutations and re-renders
- **Model**: `store.js` (in-memory state) + `storage.js` (persistence)

## Data Flow

User action → event handler in `app.js` → mutate state in `store.js` → `storage.save()` → `render*()` functions update DOM

## Module Responsibilities

| File | Responsibility |
|---|---|
| `validators.js` | `isValidTitle(title)` — pure function, no side effects |
| `storage.js` | `save(todos)` / `load()` — only touches localStorage |
| `store.js` | State object + all CRUD and filter operations |
| `render.js` | All DOM writes — called after every state change |
| `app.js` | Bootstraps app, attaches all event listeners |
