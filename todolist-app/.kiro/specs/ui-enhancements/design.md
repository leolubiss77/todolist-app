# Design Document: UI/UX Enhancements

## Overview

This design document outlines the technical implementation for three UI/UX enhancement features for the Todolist App:

1. **Dark Mode**: A theme toggle system with localStorage persistence
2. **Drag & Drop Reorder**: Visual reordering of todos with touch support
3. **Bulk Actions**: Multi-select functionality with batch operations

These features integrate with the existing vanilla JavaScript ES6+ module architecture, maintaining the current patterns of state management (store.js), persistence (storage.js), rendering (render.js), and application logic (app.js).

### Design Goals

- **Modularity**: Each feature implemented as a separate module with clear interfaces
- **Persistence**: All user preferences (theme, order, selections) persist across sessions
- **Performance**: Maintain 60fps during interactions, minimize localStorage writes
- **Accessibility**: WCAG 2.1 AA compliance for all new UI elements
- **Mobile-First**: Touch-friendly interactions with appropriate target sizes (44x44px minimum)
- **Progressive Enhancement**: Features degrade gracefully if localStorage is unavailable

## Architecture

### Module Structure

```
src/
├── app.js              # Main application entry point (existing)
├── store.js            # State management (existing)
├── storage.js          # localStorage abstraction (existing)
├── render.js           # DOM rendering (existing)
├── validators.js       # Input validation (existing)
├── theme.js            # NEW: Theme management
├── dragdrop.js         # NEW: Drag & drop handler
└── selection.js        # NEW: Bulk selection manager
```

### Data Flow

```
User Interaction
      ↓
Event Handler (app.js)
      ↓
Feature Module (theme.js / dragdrop.js / selection.js)
      ↓
State Update (store.js)
      ↓
Persistence (storage.js)
      ↓
Re-render (render.js)
```

### State Extensions

The existing `state` object in `store.js` will be extended:

```javascript
export const state = {
  todos: [],              // existing
  filter: 'all',          // existing
  theme: 'light',         // NEW: current theme
  todoOrder: [],          // NEW: array of todo IDs in display order
  selectedIds: new Set(), // NEW: set of selected todo IDs
};
```

## Components and Interfaces

### 1. Theme Manager (theme.js)

**Purpose**: Manages theme state, applies CSS classes, and persists theme preference.

**Public API**:

```javascript
/**
 * Initialize theme system on app load
 * Restores theme from localStorage or defaults to 'light'
 */
export function initTheme(): void

/**
 * Toggle between light and dark themes
 * Applies CSS class and saves to localStorage
 */
export function toggleTheme(): void

/**
 * Get current theme
 * @returns {'light' | 'dark'}
 */
export function getCurrentTheme(): string

/**
 * Apply theme to document
 * @param theme - 'light' or 'dark'
 */
export function applyTheme(theme: string): void
```

**Implementation Details**:

- Uses `data-theme` attribute on `<html>` element for CSS targeting
- Stores theme preference in localStorage key: `todolist-app-theme`
- CSS transitions handle smooth theme switching (300ms)
- Theme toggle button updates icon based on current theme

**CSS Strategy**:

```css
/* Default (light) theme uses existing CSS variables */
:root {
  --bg-main: #FFFBF0;
  --text-main: #000000;
  /* ... existing variables */
}

/* Dark theme overrides */
[data-theme="dark"] {
  --bg-main: #1a1a1a;
  --text-main: #ffffff;
  --accent-yellow: #ffd700;
  --accent-pink: #ff1493;
  --accent-cyan: #00bfff;
  --accent-green: #00ff7f;
  --white: #2a2a2a;
  --text-muted: #cccccc;
  --border: 3px solid #ffffff;
  --shadow: 4px 4px 0px #ffffff;
  --shadow-lg: 6px 6px 0px #ffffff;
  --shadow-sm: 2px 2px 0px #ffffff;
}
```

### 2. Drag & Drop Handler (dragdrop.js)

**Purpose**: Manages drag and drop reordering with visual feedback and touch support.

**Public API**:

```javascript
/**
 * Initialize drag and drop system
 * Attaches event listeners and restores saved order
 */
export function initDragDrop(): void

/**
 * Get current todo order
 * @returns Array of todo IDs in display order
 */
export function getTodoOrder(): string[]

/**
 * Set todo order and persist
 * @param orderIds - Array of todo IDs
 */
export function setTodoOrder(orderIds: string[]): void

/**
 * Reorder a todo from one index to another
 * @param fromIndex - Source index
 * @param toIndex - Destination index
 */
export function reorderTodo(fromIndex: number, toIndex: number): void
```

**Implementation Details**:

- Uses HTML5 Drag and Drop API for desktop
- Uses Touch Events API for mobile devices
- Stores order in localStorage key: `todolist-app-order`
- Visual feedback:
  - Ghost element follows cursor/touch
  - Drop zones highlighted with border
  - Original position shows reduced opacity (0.4)
  - Smooth CSS transitions for position changes

**Event Handling**:

Desktop:
- `dragstart`: Store dragged element, reduce opacity
- `dragover`: Prevent default, highlight drop zone
- `drop`: Reorder todos, update state
- `dragend`: Clean up visual states

Mobile:
- `touchstart`: Detect long press (500ms), initiate drag
- `touchmove`: Update ghost position, highlight drop zones
- `touchend`: Complete reorder or cancel

**Order Management**:

- When todos are added: append to end of order array
- When todos are deleted: remove from order array
- When todos are filtered: maintain order but only show filtered items
- Order is independent of filter state

### 3. Selection Manager (selection.js)

**Purpose**: Manages multi-select state and bulk operations.

**Public API**:

```javascript
/**
 * Initialize selection system
 * Attaches event listeners and renders selection UI
 */
export function initSelection(): void

/**
 * Toggle selection state of a todo
 * @param id - Todo ID
 */
export function toggleSelection(id: string): void

/**
 * Select all visible todos
 */
export function selectAll(): void

/**
 * Clear all selections
 */
export function clearSelection(): void

/**
 * Get currently selected todo IDs
 * @returns Set of selected IDs
 */
export function getSelectedIds(): Set<string>

/**
 * Execute bulk delete on selected todos
 */
export function bulkDelete(): void

/**
 * Execute bulk complete on selected todos
 */
export function bulkComplete(): void

/**
 * Execute bulk activate on selected todos
 */
export function bulkActivate(): void
```

**Implementation Details**:

- Selection state stored in `state.selectedIds` (Set for O(1) lookup)
- Selection is NOT persisted (clears on page reload)
- Selection clears when:
  - Filter changes
  - Bulk action completes
  - User clicks "Clear Selection"
- Visual feedback:
  - Selected todos get `.selected` CSS class
  - Bulk action panel slides in from bottom
  - Selection counter updates in real-time

**UI Components**:

1. **Selection Checkbox**: Added to each todo item
   - Positioned before existing checkbox
   - 44x44px touch target
   - Styled with neobrutalism aesthetic

2. **Master Checkbox**: Added to header area
   - Selects/deselects all visible todos
   - Shows indeterminate state when some selected

3. **Bulk Action Panel**: Fixed bottom panel
   - Only visible when selections exist
   - Contains: counter, delete, complete, activate, clear buttons
   - Slides in with CSS transition (200ms)

4. **Selection Counter**: Shows "X selected"

## Data Models

### Theme Preference

```javascript
// Stored in localStorage: 'todolist-app-theme'
type Theme = 'light' | 'dark';
```

### Todo Order

```javascript
// Stored in localStorage: 'todolist-app-order'
type TodoOrder = string[]; // Array of todo IDs
```

### Selection State

```javascript
// In-memory only (not persisted)
type SelectionState = Set<string>; // Set of selected todo IDs
```

### Extended Todo Object

No changes to the existing Todo structure:

```javascript
type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};
```

## Error Handling

### localStorage Failures

All features must handle localStorage unavailability gracefully:

```javascript
// Theme: Falls back to light theme
// Order: Falls back to createdAt descending sort
// Selection: Works in-memory only
```

**Error Handling Strategy**:

1. Wrap all localStorage operations in try-catch
2. Log warnings to console (not user-facing errors)
3. Provide sensible defaults
4. Continue operation without persistence

### Drag & Drop Edge Cases

- **Invalid drop**: Return todo to original position with animation
- **Drag cancel** (ESC key): Cancel operation, restore original state
- **Touch scroll conflict**: Prevent default scroll only during active drag
- **Rapid interactions**: Debounce reorder operations (100ms)

### Selection Edge Cases

- **Select deleted todo**: Automatically remove from selection state
- **Select filtered-out todo**: Maintain selection but hide from UI
- **Bulk action on empty selection**: Disable buttons (should not occur)
- **Concurrent modifications**: Selection state updates synchronously

## Testing Strategy

### Property-Based Testing Applicability Assessment

These UI enhancement features are **NOT suitable for property-based testing** because:

1. **Dark Mode**: 
   - Tests configuration and CSS application (one-time setup)
   - Behavior doesn't vary meaningfully with input
   - Theme is either 'light' or 'dark' - only 2 states to test
   - Classification: **SMOKE** tests for initialization, **EXAMPLE** tests for toggle

2. **Drag & Drop Reorder**:
   - Tests UI interaction and DOM manipulation
   - Heavy reliance on browser APIs (DragEvent, TouchEvent)
   - Visual feedback verification requires DOM inspection
   - Order persistence can be tested, but the drag interaction itself cannot
   - Classification: **INTEGRATION** tests for interaction, **EXAMPLE** tests for order persistence

3. **Bulk Actions**:
   - Tests UI state management and batch operations
   - Selection state is straightforward Set operations
   - Bulk operations are simple loops over selected items
   - Classification: **EXAMPLE** tests for selection logic, **INTEGRATION** tests for UI

**Conclusion**: Skip the Correctness Properties section. Use example-based unit tests and integration tests instead.

### Testing Approach

#### Unit Tests

**Theme Module** (`tests/theme.test.js`):
- Theme initialization with/without localStorage
- Theme toggle switches between light/dark
- Theme persistence to localStorage
- Theme application to DOM (data-theme attribute)
- Default to light theme when no preference exists

**Drag & Drop Module** (`tests/dragdrop.test.js`):
- Order initialization from localStorage
- Order persistence after reorder
- Reorder operation updates state correctly
- Adding todo appends to order
- Deleting todo removes from order
- Order survives filter changes

**Selection Module** (`tests/selection.test.js`):
- Toggle selection adds/removes from Set
- Select all adds all visible todos
- Clear selection empties Set
- Bulk delete removes selected todos
- Bulk complete marks selected as completed
- Bulk activate marks selected as active
- Selection clears on filter change
- Selection updates when todo deleted

#### Integration Tests

**Theme Integration** (`tests/integration/theme.integration.test.js`):
- Theme toggle updates UI immediately
- Theme persists across page reload (mock localStorage)
- CSS variables update correctly for dark theme
- Theme toggle button icon updates

**Drag & Drop Integration** (`tests/integration/dragdrop.integration.test.js`):
- Drag operation updates visual state
- Drop completes reorder and persists
- Touch events trigger drag on mobile
- Cancel drag restores original position
- Reorder works with filtered todos

**Selection Integration** (`tests/integration/selection.integration.test.js`):
- Selecting todos shows bulk action panel
- Bulk action panel hides when selection cleared
- Master checkbox selects all visible todos
- Bulk delete removes todos and clears selection
- Selection state preserved during reorder

#### Manual Testing Checklist

- [ ] Theme toggle works on first load
- [ ] Theme persists across browser refresh
- [ ] Dark theme has sufficient contrast (WCAG AA)
- [ ] Drag works with mouse on desktop
- [ ] Drag works with touch on mobile
- [ ] Long press initiates drag on mobile
- [ ] Drop zones highlight correctly
- [ ] Reorder persists across refresh
- [ ] Selection checkboxes are 44x44px
- [ ] Bulk action buttons work correctly
- [ ] Master checkbox has indeterminate state
- [ ] Selection clears on filter change
- [ ] All features work together harmoniously

### Test Configuration

- **Test Framework**: Vitest with jsdom
- **Test Coverage Target**: 80% line coverage for new modules
- **Test Execution**: `npm test` runs all tests
- **Minimum Iterations**: N/A (no property-based tests)

## Performance Considerations

### Theme Switching

- Use CSS transitions (GPU-accelerated) instead of JavaScript animations
- Apply theme via single class change on root element
- Target: < 300ms for complete theme transition

### Drag & Drop

- Use CSS `transform` for positioning (GPU-accelerated)
- Avoid layout thrashing: batch DOM reads/writes
- Use `requestAnimationFrame` for smooth ghost element updates
- Target: 60fps (16ms per frame) during drag operations
- Debounce localStorage writes during drag (save only on drop)

### Selection

- Use Set for O(1) selection lookup
- Update counter with debounce (100ms) to avoid excessive re-renders
- Batch DOM updates when rendering selection state
- Target: < 100ms for selection state updates

### localStorage Optimization

- Debounce save operations to prevent excessive writes
- Use separate keys for each feature (theme, order, todos)
- Compress order array (store only IDs, not full objects)
- Implement write coalescing: batch multiple changes into single write

### Memory Management

- Clean up event listeners on module destruction
- Remove ghost elements after drag completes
- Clear selection state when not needed
- Avoid memory leaks in long-running sessions

## Accessibility

### Theme Toggle

- Button has `aria-label` describing current theme
- Keyboard accessible (Tab, Enter/Space)
- Focus visible with outline
- Icon changes to indicate state

### Drag & Drop

- Keyboard alternative: Arrow keys + modifier to reorder
- Screen reader announces reorder operations
- Focus management during drag
- Visual focus indicators

### Selection

- Checkboxes have `aria-label` with todo title
- Master checkbox has `aria-label` "Select all"
- Bulk action buttons have descriptive labels
- Selection counter has `aria-live="polite"`
- Keyboard navigation: Tab through checkboxes, Space to toggle

### Color Contrast

- Dark theme maintains WCAG AA contrast ratios (4.5:1 for text)
- Selection highlight has sufficient contrast
- Focus indicators visible in both themes

## Mobile Considerations

### Touch Targets

- All interactive elements: minimum 44x44px
- Adequate spacing between touch targets (8px minimum)
- Theme toggle button: 48x48px
- Selection checkboxes: 44x44px

### Touch Gestures

- Long press (500ms) initiates drag
- Tap to select checkbox
- Swipe to scroll (not conflicting with drag)
- Haptic feedback on drag start (if supported)

### Responsive Behavior

- Bulk action panel: full width on mobile
- Theme toggle: positioned in header (always visible)
- Drag ghost element: scaled appropriately for touch
- Selection checkboxes: larger on mobile (48x48px)

### Performance on Mobile

- Minimize reflows during drag
- Use passive event listeners where possible
- Throttle touch move events (16ms)
- Test on low-end devices (target: 60fps on 3-year-old devices)

## Browser Compatibility

### Target Browsers

- Chrome/Edge: last 2 versions
- Firefox: last 2 versions
- Safari: last 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Android 10+

### Feature Detection

```javascript
// Check for localStorage
const hasLocalStorage = (() => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
})();

// Check for touch support
const hasTouch = 'ontouchstart' in window;

// Check for drag and drop support
const hasDragDrop = 'draggable' in document.createElement('div');
```

### Polyfills

Not required - all features use standard APIs available in target browsers.

## Security Considerations

### localStorage

- No sensitive data stored (only preferences and UI state)
- Validate data read from localStorage before use
- Handle malformed JSON gracefully
- No XSS risk (no user content in localStorage keys)

### DOM Manipulation

- All user input sanitized through existing validators
- No `innerHTML` usage with user content
- Event delegation prevents injection attacks

## Migration Strategy

### Rollout Plan

1. **Phase 1**: Deploy theme module (low risk)
2. **Phase 2**: Deploy drag & drop (medium risk)
3. **Phase 3**: Deploy selection module (medium risk)

### Backward Compatibility

- Existing todos remain compatible (no schema changes)
- New localStorage keys don't conflict with existing data
- Features degrade gracefully if disabled
- No breaking changes to existing functionality

### Data Migration

No migration needed - all new features use separate localStorage keys.

## Future Enhancements

### Potential Improvements

1. **Theme**: Add more themes (high contrast, sepia)
2. **Drag & Drop**: Add keyboard shortcuts for reordering
3. **Selection**: Add "Select by filter" (e.g., select all completed)
4. **Performance**: Implement virtual scrolling for large lists (1000+ todos)
5. **Sync**: Cloud sync for theme/order preferences across devices

### Extension Points

- Theme system can be extended with custom color schemes
- Drag & drop can support drag-to-delete gesture
- Selection can support range selection (Shift+click)
