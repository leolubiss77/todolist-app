// render.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { renderTodos, renderFilters, renderClearButton, showValidationMessage } from '../src/render.js';

// ─── DOM Setup Helpers ────────────────────────────────────────────────────────

function setupDOM() {
  document.body.innerHTML = `
    <ul id="todo-list"></ul>
    <p id="empty-message" hidden></p>
    <div id="filter-buttons">
      <button class="filter-btn active" data-filter="all">Semua</button>
      <button class="filter-btn" data-filter="active">Belum Selesai</button>
      <button class="filter-btn" data-filter="completed">Selesai</button>
    </div>
    <button id="clear-completed-btn" hidden></button>
    <form id="todo-form">
      <input type="text" id="todo-input" />
      <p id="validation-message" hidden></p>
    </form>
  `;
}

beforeEach(() => {
  setupDOM();
});

// ─── Arbitrary ────────────────────────────────────────────────────────────────

const todoArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  completed: fc.boolean(),
  createdAt: fc.integer({ min: 0 }),
});

// ─── Unit Tests (Task 8.6) ────────────────────────────────────────────────────

describe('renderTodos', () => {
  it('shows empty message when todos is empty', () => {
    // Validates: Requirements 2.2
    renderTodos([]);
    const emptyMsg = document.getElementById('empty-message');
    const list = document.getElementById('todo-list');
    expect(emptyMsg.hidden).toBe(false);
    expect(list.children.length).toBe(0);
  });

  it('hides empty message when todos is non-empty', () => {
    renderTodos([{ id: '1', title: 'Task', completed: false, createdAt: 1000 }]);
    const emptyMsg = document.getElementById('empty-message');
    expect(emptyMsg.hidden).toBe(true);
  });

  it('renders a completed todo with strikethrough and completed class', () => {
    // Validates: Requirements 3.2
    const todo = { id: '1', title: 'Done task', completed: true, createdAt: 1000 };
    renderTodos([todo]);
    const li = document.querySelector('#todo-list li');
    expect(li.classList.contains('completed')).toBe(true);
    expect(li.querySelector('s')).not.toBeNull();
    expect(li.querySelector('s').textContent).toBe('Done task');
  });

  it('renders an active todo without strikethrough', () => {
    const todo = { id: '1', title: 'Active task', completed: false, createdAt: 1000 };
    renderTodos([todo]);
    const li = document.querySelector('#todo-list li');
    expect(li.classList.contains('completed')).toBe(false);
    expect(li.querySelector('s')).toBeNull();
  });

  it('renders data-id, data-action attributes on interactive elements', () => {
    const todo = { id: 'abc-123', title: 'Task', completed: false, createdAt: 1000 };
    renderTodos([todo]);
    const li = document.querySelector('#todo-list li');
    expect(li.dataset.id).toBe('abc-123');
    const checkbox = li.querySelector('input[type="checkbox"]');
    expect(checkbox.dataset.action).toBe('toggle');
    expect(checkbox.dataset.id).toBe('abc-123');
    const editBtn = li.querySelector('[data-action="edit"]');
    expect(editBtn.dataset.id).toBe('abc-123');
    const deleteBtn = li.querySelector('[data-action="delete"]');
    expect(deleteBtn.dataset.id).toBe('abc-123');
  });
});

describe('renderFilters', () => {
  it('sets active class on the matching filter button', () => {
    // Validates: Requirements 6.5
    renderFilters('active');
    const allBtn = document.querySelector('[data-filter="all"]');
    const activeBtn = document.querySelector('[data-filter="active"]');
    const completedBtn = document.querySelector('[data-filter="completed"]');
    expect(allBtn.classList.contains('active')).toBe(false);
    expect(activeBtn.classList.contains('active')).toBe(true);
    expect(completedBtn.classList.contains('active')).toBe(false);
  });

  it('sets active class on "all" filter', () => {
    renderFilters('all');
    expect(document.querySelector('[data-filter="all"]').classList.contains('active')).toBe(true);
  });
});

describe('renderClearButton', () => {
  it('shows button when at least one todo is completed', () => {
    // Validates: Requirements 7.1
    renderClearButton([
      { id: '1', title: 'A', completed: true, createdAt: 1 },
      { id: '2', title: 'B', completed: false, createdAt: 2 },
    ]);
    expect(document.getElementById('clear-completed-btn').hidden).toBe(false);
  });

  it('hides button when no todos are completed', () => {
    // Validates: Requirements 7.4
    renderClearButton([
      { id: '1', title: 'A', completed: false, createdAt: 1 },
    ]);
    expect(document.getElementById('clear-completed-btn').hidden).toBe(true);
  });

  it('hides button when todos list is empty', () => {
    renderClearButton([]);
    expect(document.getElementById('clear-completed-btn').hidden).toBe(true);
  });
});

// ─── Property-Based Tests ─────────────────────────────────────────────────────

// Feature: todolist-app, Property 8: render order newest-first
describe('Property 8: Todo list rendered in newest-to-oldest order', () => {
  it('items appear in descending createdAt order', () => {
    // Validates: Requirements 2.1
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
            completed: fc.boolean(),
            createdAt: fc.integer({ min: 0, max: 1_000_000_000 }),
          }),
          { minLength: 1 }
        ),
        (todos) => {
          setupDOM();
          renderTodos(todos);
          const items = Array.from(document.querySelectorAll('#todo-list li'));
          const renderedIds = items.map(li => li.dataset.id);
          const expectedIds = [...todos]
            .sort((a, b) => b.createdAt - a.createdAt)
            .map(t => t.id);
          expect(renderedIds).toEqual(expectedIds);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todolist-app, Property 9: render includes all required fields
describe('Property 9: Each todo rendered with all required fields', () => {
  it('each DOM item contains title, status indicator, and creation time', () => {
    // Validates: Requirements 2.3
    fc.assert(
      fc.property(
        fc.array(todoArb, { minLength: 1 }),
        (todos) => {
          setupDOM();
          renderTodos(todos);
          const items = Array.from(document.querySelectorAll('#todo-list li'));
          expect(items.length).toBe(todos.length);
          for (const li of items) {
            // Must have a title element
            const titleEl = li.querySelector('.todo-title');
            expect(titleEl).not.toBeNull();
            expect(titleEl.textContent.trim().length).toBeGreaterThan(0);
            // Must have a status indicator (checkbox)
            const checkbox = li.querySelector('input[type="checkbox"]');
            expect(checkbox).not.toBeNull();
            // Must have a creation time element
            const timeEl = li.querySelector('.todo-time');
            expect(timeEl).not.toBeNull();
            expect(timeEl.textContent.trim().length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todolist-app, Property 7: clear-button visibility consistent
describe('Property 7: "Hapus Selesai" button visibility consistent with state', () => {
  it('button shown iff at least one todo has completed=true', () => {
    // Validates: Requirements 7.1, 7.4
    fc.assert(
      fc.property(
        fc.array(todoArb),
        (todos) => {
          setupDOM();
          renderClearButton(todos);
          const btn = document.getElementById('clear-completed-btn');
          const hasCompleted = todos.some(t => t.completed);
          expect(btn.hidden).toBe(!hasCompleted);
        }
      ),
      { numRuns: 100 }
    );
  });
});
