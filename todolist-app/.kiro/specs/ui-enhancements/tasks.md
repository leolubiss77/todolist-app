# Tasks: UI/UX Enhancements

## Overview

This document outlines the implementation tasks for three UI/UX enhancement features: Dark Mode, Drag & Drop Reorder, and Bulk Actions. Tasks are organized by feature and include testing requirements.

---

## Phase 1: Dark Mode Implementation

### 1. Theme Module Core

- [ ] 1.1 Create `src/theme.js` module with theme state management
- [ ] 1.2 Implement `initTheme()` function to restore theme from localStorage
- [ ] 1.3 Implement `toggleTheme()` function to switch between light/dark
- [ ] 1.4 Implement `getCurrentTheme()` function to return current theme
- [ ] 1.5 Implement `applyTheme(theme)` function to set data-theme attribute on html element
- [ ] 1.6 Add localStorage persistence with key `todolist-app-theme`
- [ ] 1.7 Add error handling for localStorage failures (fallback to light theme)

### 2. Theme CSS Styling

- [ ] 2.1 Add `[data-theme="dark"]` CSS selector to style.css
- [ ] 2.2 Define dark theme color variables (bg-main, text-main, etc.)
- [ ] 2.3 Ensure dark theme maintains WCAG AA contrast ratios (4.5:1 minimum)
- [ ] 2.4 Add CSS transitions for smooth theme switching (300ms)
- [ ] 2.5 Style drag ghost elements for dark theme
- [ ] 2.6 Style bulk action panel for dark theme
- [ ] 2.7 Test all UI components in dark theme for visual consistency

### 3. Theme Toggle UI

- [ ] 3.1 Add theme toggle button to app header in index.html
- [ ] 3.2 Style theme toggle button with neobrutalism aesthetic
- [ ] 3.3 Add icon/text to indicate current theme (e.g., 🌙/☀️)
- [ ] 3.4 Ensure toggle button is 48x48px for touch accessibility
- [ ] 3.5 Add aria-label to toggle button describing action
- [ ] 3.6 Wire up click event handler in app.js to call toggleTheme()
- [ ] 3.7 Update toggle button icon when theme changes

### 4. Theme Integration

- [ ] 4.1 Call initTheme() in app.js DOMContentLoaded handler
- [ ] 4.2 Extend state object in store.js to include theme property
- [ ] 4.3 Test theme persistence across page reloads
- [ ] 4.4 Test theme toggle updates UI immediately
- [ ] 4.5 Verify theme works with all existing features (filters, edit, etc.)

### 5. Theme Testing

- [ ] 5.1 Create `tests/theme.test.js` with unit tests
- [ ] 5.2 Test initTheme() with existing localStorage value
- [ ] 5.3 Test initTheme() without localStorage (defaults to light)
- [ ] 5.4 Test toggleTheme() switches between light and dark
- [ ] 5.5 Test applyTheme() sets correct data-theme attribute
- [ ] 5.6 Test localStorage persistence after theme change
- [ ] 5.7 Test error handling when localStorage unavailable
- [ ] 5.8 Create integration test for theme toggle UI interaction

---

## Phase 2: Drag & Drop Reorder Implementation

### 6. Drag & Drop Module Core

- [ ] 6.1 Create `src/dragdrop.js` module with drag state management
- [ ] 6.2 Implement `initDragDrop()` function to attach event listeners
- [ ] 6.3 Implement `getTodoOrder()` function to return current order array
- [ ] 6.4 Implement `setTodoOrder(orderIds)` function to update and persist order
- [ ] 6.5 Implement `reorderTodo(fromIndex, toIndex)` function to reorder todos
- [ ] 6.6 Add localStorage persistence with key `todolist-app-order`
- [ ] 6.7 Add error handling for localStorage failures (fallback to createdAt sort)

### 7. Desktop Drag & Drop

- [ ] 7.1 Add `draggable="true"` attribute to todo list items in render.js
- [ ] 7.2 Implement dragstart event handler (store dragged element, reduce opacity)
- [ ] 7.3 Implement dragover event handler (prevent default, highlight drop zone)
- [ ] 7.4 Implement drop event handler (reorder todos, update state, persist)
- [ ] 7.5 Implement dragend event handler (clean up visual states)
- [ ] 7.6 Add CSS for drag ghost element styling
- [ ] 7.7 Add CSS for drop zone highlighting (border animation)
- [ ] 7.8 Add CSS for dragging state (opacity 0.4 on original position)

### 8. Mobile Touch Support

- [ ] 8.1 Implement touchstart event handler (detect long press 500ms)
- [ ] 8.2 Implement touchmove event handler (update ghost position, highlight zones)
- [ ] 8.3 Implement touchend event handler (complete reorder or cancel)
- [ ] 8.4 Create ghost element for touch drag (follows finger)
- [ ] 8.5 Prevent default scroll behavior during active drag
- [ ] 8.6 Add haptic feedback on drag start (if supported)
- [ ] 8.7 Test touch drag on mobile devices (iOS Safari, Chrome Mobile)

### 9. Drag & Drop Integration

- [ ] 9.1 Extend state object in store.js to include todoOrder array
- [ ] 9.2 Update renderTodos() to respect custom order from getTodoOrder()
- [ ] 9.3 Update addTodo() to append new todo ID to order array
- [ ] 9.4 Update deleteTodo() to remove todo ID from order array
- [ ] 9.5 Ensure order persists across filter changes
- [ ] 9.6 Call initDragDrop() in app.js DOMContentLoaded handler
- [ ] 9.7 Test drag & drop with filtered todos (order maintained)

### 10. Drag & Drop Edge Cases

- [ ] 10.1 Implement drag cancel on ESC key press
- [ ] 10.2 Handle invalid drop (return to original position with animation)
- [ ] 10.3 Debounce reorder operations (100ms) to prevent rapid changes
- [ ] 10.4 Handle concurrent drag attempts (disable during active drag)
- [ ] 10.5 Test drag & drop with empty list
- [ ] 10.6 Test drag & drop with single item (no-op)

### 11. Drag & Drop Testing

- [ ] 11.1 Create `tests/dragdrop.test.js` with unit tests
- [ ] 11.2 Test initDragDrop() restores order from localStorage
- [ ] 11.3 Test setTodoOrder() persists to localStorage
- [ ] 11.4 Test reorderTodo() updates state correctly
- [ ] 11.5 Test adding todo appends to order array
- [ ] 11.6 Test deleting todo removes from order array
- [ ] 11.7 Test order survives filter changes
- [ ] 11.8 Create integration test for drag & drop interaction

---

## Phase 3: Bulk Actions Implementation

### 12. Selection Module Core

- [ ] 12.1 Create `src/selection.js` module with selection state management
- [ ] 12.2 Implement `initSelection()` function to attach event listeners
- [ ] 12.3 Implement `toggleSelection(id)` function to add/remove from Set
- [ ] 12.4 Implement `selectAll()` function to select all visible todos
- [ ] 12.5 Implement `clearSelection()` function to empty selection Set
- [ ] 12.6 Implement `getSelectedIds()` function to return current selections
- [ ] 12.7 Implement `bulkDelete()` function to delete selected todos
- [ ] 12.8 Implement `bulkComplete()` function to mark selected as completed
- [ ] 12.9 Implement `bulkActivate()` function to mark selected as active

### 13. Selection UI Components

- [ ] 13.1 Add selection checkbox to each todo item in render.js
- [ ] 13.2 Style selection checkbox with neobrutalism aesthetic (44x44px)
- [ ] 13.3 Add master checkbox to header area in index.html
- [ ] 13.4 Style master checkbox (44x44px, indeterminate state support)
- [ ] 13.5 Create bulk action panel HTML structure in index.html
- [ ] 13.6 Style bulk action panel (fixed bottom, slide-in animation 200ms)
- [ ] 13.7 Add selection counter element to bulk action panel
- [ ] 13.8 Add bulk action buttons (delete, complete, activate, clear)

### 14. Selection Visual Feedback

- [ ] 14.1 Add `.selected` CSS class for selected todos (highlight background)
- [ ] 14.2 Update selection checkboxes when selection state changes
- [ ] 14.3 Update master checkbox state (checked/unchecked/indeterminate)
- [ ] 14.4 Show/hide bulk action panel based on selection count
- [ ] 14.5 Update selection counter in real-time (debounce 100ms)
- [ ] 14.6 Add CSS transitions for selection state changes
- [ ] 14.7 Ensure selected state visible in both light and dark themes

### 15. Selection Integration

- [ ] 15.1 Extend state object in store.js to include selectedIds Set
- [ ] 15.2 Wire up selection checkbox click events in app.js
- [ ] 15.3 Wire up master checkbox click event in app.js
- [ ] 15.4 Wire up bulk action button click events in app.js
- [ ] 15.5 Clear selection when filter changes
- [ ] 15.6 Remove deleted todos from selection state
- [ ] 15.7 Preserve selection state during reorder operations
- [ ] 15.8 Call initSelection() in app.js DOMContentLoaded handler

### 16. Bulk Actions Execution

- [ ] 16.1 Implement bulk delete: loop through selected IDs, call deleteTodo()
- [ ] 16.2 Implement bulk complete: loop through selected IDs, set completed=true
- [ ] 16.3 Implement bulk activate: loop through selected IDs, set completed=false
- [ ] 16.4 Clear selection after bulk action completes
- [ ] 16.5 Save state to localStorage after bulk action
- [ ] 16.6 Re-render todos after bulk action
- [ ] 16.7 Hide bulk action panel after action completes
- [ ] 16.8 Update drag & drop order array after bulk delete

### 17. Selection Edge Cases

- [ ] 17.1 Handle selecting already-deleted todo (remove from selection)
- [ ] 17.2 Handle bulk action on empty selection (disable buttons)
- [ ] 17.3 Handle master checkbox with no visible todos (disable)
- [ ] 17.4 Handle selection during drag operation (prevent selection changes)
- [ ] 17.5 Test selection with filtered todos (only visible items selectable)
- [ ] 17.6 Test selection state after filter change (clears selection)

### 18. Selection Testing

- [ ] 18.1 Create `tests/selection.test.js` with unit tests
- [ ] 18.2 Test toggleSelection() adds/removes from Set
- [ ] 18.3 Test selectAll() adds all visible todos
- [ ] 18.4 Test clearSelection() empties Set
- [ ] 18.5 Test bulkDelete() removes selected todos
- [ ] 18.6 Test bulkComplete() marks selected as completed
- [ ] 18.7 Test bulkActivate() marks selected as active
- [ ] 18.8 Test selection clears on filter change
- [ ] 18.9 Test selection updates when todo deleted
- [ ] 18.10 Create integration test for bulk actions UI

---

## Phase 4: Integration & Polish

### 19. Feature Interaction Testing

- [ ] 19.1 Test theme toggle with drag & drop active
- [ ] 19.2 Test theme toggle with selections active
- [ ] 19.3 Test drag & drop with selections (preserve selection state)
- [ ] 19.4 Test bulk delete updates drag order correctly
- [ ] 19.5 Test all features work with existing filters
- [ ] 19.6 Test all features work with existing edit functionality
- [ ] 19.7 Test all features work with existing clear completed

### 20. Performance Optimization

- [ ] 20.1 Measure theme switch time (target < 300ms)
- [ ] 20.2 Measure drag & drop frame rate (target 60fps)
- [ ] 20.3 Measure selection update time (target < 100ms)
- [ ] 20.4 Implement debouncing for localStorage writes
- [ ] 20.5 Optimize renderTodos() for large lists (100+ items)
- [ ] 20.6 Profile memory usage during long sessions
- [ ] 20.7 Test performance on low-end mobile devices

### 21. Accessibility Audit

- [ ] 21.1 Test keyboard navigation for theme toggle (Tab, Enter/Space)
- [ ] 21.2 Test keyboard navigation for selection (Tab, Space)
- [ ] 21.3 Test screen reader announcements for all actions
- [ ] 21.4 Verify all interactive elements have aria-labels
- [ ] 21.5 Verify focus indicators visible in both themes
- [ ] 21.6 Test color contrast ratios (WCAG AA: 4.5:1 minimum)
- [ ] 21.7 Test with keyboard-only navigation (no mouse)

### 22. Mobile Testing

- [ ] 22.1 Test theme toggle on iOS Safari
- [ ] 22.2 Test theme toggle on Chrome Mobile
- [ ] 22.3 Test drag & drop touch events on iOS
- [ ] 22.4 Test drag & drop touch events on Android
- [ ] 22.5 Test selection checkboxes on touch devices (44x44px targets)
- [ ] 22.6 Test bulk action panel on mobile (full width, easy to tap)
- [ ] 22.7 Test all features on tablet devices

### 23. Browser Compatibility

- [ ] 23.1 Test all features on Chrome (latest)
- [ ] 23.2 Test all features on Firefox (latest)
- [ ] 23.3 Test all features on Safari (latest)
- [ ] 23.4 Test all features on Edge (latest)
- [ ] 23.5 Test localStorage fallback behavior
- [ ] 23.6 Test with browser extensions (ad blockers, etc.)

### 24. Documentation & Cleanup

- [ ] 24.1 Update README.md with new features documentation
- [ ] 24.2 Add JSDoc comments to all new functions
- [ ] 24.3 Update PROJECT_STRUCTURE.md with new modules
- [ ] 24.4 Create user guide for new features
- [ ] 24.5 Update CHANGELOG.md with feature additions
- [ ] 24.6 Remove console.log statements from production code
- [ ] 24.7 Run linter and fix any issues

---

## Summary

**Total Tasks**: 24 groups, 150+ individual tasks

**Estimated Effort**:
- Phase 1 (Dark Mode): 2-3 days
- Phase 2 (Drag & Drop): 4-5 days
- Phase 3 (Bulk Actions): 4-5 days
- Phase 4 (Integration): 2-3 days

**Total Estimated Time**: 12-16 days

**Dependencies**:
- Phase 1 can start immediately
- Phase 2 can start after Phase 1 (theme CSS needed for drag ghost)
- Phase 3 can start in parallel with Phase 2
- Phase 4 requires all previous phases complete

**Risk Areas**:
- Touch event handling on mobile (cross-browser compatibility)
- Performance with large todo lists (100+ items)
- Accessibility compliance (requires manual testing)
- localStorage quota limits (unlikely but possible)
