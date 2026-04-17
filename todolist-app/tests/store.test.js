// store.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  state,
  resetState,
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  clearCompleted,
  setFilter,
  getFilteredTodos,
} from '../src/store.js';

// Arbitrary for a valid todo object
const todoArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
  completed: fc.boolean(),
  createdAt: fc.integer({ min: 0 }),
});

// Helper: seed state.todos with an array of todos
function seedTodos(todos) {
  state.todos = todos.map(t => ({ ...t }));
}

beforeEach(() => {
  resetState();
});

// ─── Unit Tests (Task 5.10) ───────────────────────────────────────────────────

describe('addTodo', () => {
  it('adds a todo to the list', () => {
    addTodo('Buy milk');
    expect(state.todos).toHaveLength(1);
    expect(state.todos[0].title).toBe('Buy milk');
  });

  it('returns the new todo with completed=false', () => {
    const todo = addTodo('Write tests');
    expect(todo.completed).toBe(false);
    expect(todo.id).toBeDefined();
    expect(todo.createdAt).toBeTypeOf('number');
  });

  it('adds multiple todos', () => {
    addTodo('Task 1');
    addTodo('Task 2');
    expect(state.todos).toHaveLength(2);
  });
});

describe('toggleTodo', () => {
  it('marks an incomplete todo as completed', () => {
    const todo = addTodo('Task');
    toggleTodo(todo.id);
    expect(state.todos[0].completed).toBe(true);
  });

  it('marks a completed todo as incomplete', () => {
    const todo = addTodo('Task');
    toggleTodo(todo.id);
    toggleTodo(todo.id);
    expect(state.todos[0].completed).toBe(false);
  });

  it('does nothing for unknown id', () => {
    addTodo('Task');
    toggleTodo('nonexistent-id');
    expect(state.todos[0].completed).toBe(false);
  });
});

describe('deleteTodo', () => {
  it('removes the todo with the given id', () => {
    const todo = addTodo('Task');
    deleteTodo(todo.id);
    expect(state.todos).toHaveLength(0);
  });

  it('only removes the targeted todo', () => {
    const t1 = addTodo('Task 1');
    const t2 = addTodo('Task 2');
    deleteTodo(t1.id);
    expect(state.todos).toHaveLength(1);
    expect(state.todos[0].id).toBe(t2.id);
  });
});

describe('editTodo', () => {
  it('updates the title of the matching todo', () => {
    const todo = addTodo('Old title');
    editTodo(todo.id, 'New title');
    expect(state.todos[0].title).toBe('New title');
  });

  it('does not update if newTitle is blank', () => {
    const todo = addTodo('Original');
    editTodo(todo.id, '   ');
    expect(state.todos[0].title).toBe('Original');
  });

  it('does nothing for unknown id', () => {
    addTodo('Task');
    editTodo('nonexistent', 'New');
    expect(state.todos[0].title).toBe('Task');
  });

  // Task 5.1: Unit test baru untuk editTodo dengan aturan validasi baru
  it('updates title when new title is valid (3–50 characters)', () => {
    const todo = addTodo('Original title');
    editTodo(todo.id, 'Valid');
    expect(state.todos[0].title).toBe('Valid');
  });

  it('updates title when new title is exactly 3 characters (lower bound)', () => {
    const todo = addTodo('Original title');
    editTodo(todo.id, 'abc');
    expect(state.todos[0].title).toBe('abc');
  });

  it('updates title when new title is exactly 50 characters (upper bound)', () => {
    const todo = addTodo('Original title');
    const fiftyChars = 'a'.repeat(50);
    editTodo(todo.id, fiftyChars);
    expect(state.todos[0].title).toBe(fiftyChars);
  });

  it('does not update title when new title is too short (< 3 characters)', () => {
    const todo = addTodo('Original title');
    editTodo(todo.id, 'ab');
    expect(state.todos[0].title).toBe('Original title');
  });

  it('does not update title when new title is 1 character', () => {
    const todo = addTodo('Original title');
    editTodo(todo.id, 'x');
    expect(state.todos[0].title).toBe('Original title');
  });

  it('does not update title when new title is too long (> 50 characters)', () => {
    const todo = addTodo('Original title');
    const fiftyOneChars = 'a'.repeat(51);
    editTodo(todo.id, fiftyOneChars);
    expect(state.todos[0].title).toBe('Original title');
  });
});

describe('clearCompleted', () => {
  it('removes all completed todos', () => {
    const t1 = addTodo('Task 1');
    const t2 = addTodo('Task 2');
    toggleTodo(t1.id);
    clearCompleted();
    expect(state.todos).toHaveLength(1);
    expect(state.todos[0].id).toBe(t2.id);
  });

  it('does nothing when no todos are completed', () => {
    addTodo('Task 1');
    addTodo('Task 2');
    clearCompleted();
    expect(state.todos).toHaveLength(2);
  });
});

describe('setFilter / getFilteredTodos', () => {
  it('filter "all" returns all todos', () => {
    const t1 = addTodo('Task 1');
    const t2 = addTodo('Task 2');
    toggleTodo(t1.id);
    setFilter('all');
    expect(getFilteredTodos()).toHaveLength(2);
  });

  it('filter "active" returns only incomplete todos', () => {
    const t1 = addTodo('Task 1');
    addTodo('Task 2');
    toggleTodo(t1.id);
    setFilter('active');
    const result = getFilteredTodos();
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(false);
  });

  it('filter "completed" returns only completed todos', () => {
    const t1 = addTodo('Task 1');
    addTodo('Task 2');
    toggleTodo(t1.id);
    setFilter('completed');
    const result = getFilteredTodos();
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(true);
  });
});

// ─── Property-Based Tests ─────────────────────────────────────────────────────

// Feature: todolist-app, Property 1: add increases list length
describe('Property 1: Adding a task increases list length', () => {
  it('length increases by exactly 1 and new todo has completed=false', () => {
    // Validates: Requirements 1.2
    fc.assert(
      fc.property(
        fc.array(todoArb),
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (todos, title) => {
          seedTodos(todos);
          const before = state.todos.length;
          const newTodo = addTodo(title);
          expect(state.todos.length).toBe(before + 1);
          expect(newTodo.completed).toBe(false);
          expect(state.todos.some(t => t.id === newTodo.id)).toBe(true);
          resetState();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todolist-app, Property 3: toggle round-trip
describe('Property 3: Toggle status is a round-trip operation', () => {
  it('toggling twice returns to original status', () => {
    // Validates: Requirements 3.2, 3.3
    fc.assert(
      fc.property(
        fc.array(todoArb, { minLength: 1 }),
        fc.integer({ min: 0 }),
        (todos, idx) => {
          seedTodos(todos);
          const target = state.todos[idx % state.todos.length];
          const originalStatus = target.completed;
          toggleTodo(target.id);
          toggleTodo(target.id);
          const after = state.todos.find(t => t.id === target.id);
          expect(after.completed).toBe(originalStatus);
          resetState();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todolist-app, Property 10: delete removes only target
describe('Property 10: Deleting a task removes it from the list', () => {
  it('deleted task is gone; all other tasks remain', () => {
    // Validates: Requirements 5.2
    fc.assert(
      fc.property(
        fc.array(todoArb, { minLength: 1 }),
        fc.integer({ min: 0 }),
        (todos, idx) => {
          seedTodos(todos);
          const target = state.todos[idx % state.todos.length];
          const otherIds = state.todos.filter(t => t.id !== target.id).map(t => t.id);
          deleteTodo(target.id);
          expect(state.todos.find(t => t.id === target.id)).toBeUndefined();
          for (const id of otherIds) {
            expect(state.todos.find(t => t.id === id)).toBeDefined();
          }
          resetState();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todolist-app, Property 6: clearCompleted removes all completed
describe('Property 6: clearCompleted removes all completed tasks', () => {
  it('no completed todos remain; active todos are preserved', () => {
    // Validates: Requirements 7.2
    fc.assert(
      fc.property(
        fc.array(todoArb),
        (todos) => {
          seedTodos(todos);
          const activeIds = state.todos.filter(t => !t.completed).map(t => t.id);
          clearCompleted();
          expect(state.todos.every(t => !t.completed)).toBe(true);
          for (const id of activeIds) {
            expect(state.todos.find(t => t.id === id)).toBeDefined();
          }
          resetState();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todolist-app, Property 4: filter returns consistent subset
describe('Property 4: Filter returns consistent subset', () => {
  it('filtered todos match the active filter criteria exactly', () => {
    // Validates: Requirements 6.2, 6.3, 6.4
    fc.assert(
      fc.property(
        fc.array(todoArb),
        fc.constantFrom('all', 'active', 'completed'),
        (todos, filter) => {
          seedTodos(todos);
          setFilter(filter);
          const result = getFilteredTodos();
          if (filter === 'all') {
            expect(result.length).toBe(state.todos.length);
          } else if (filter === 'active') {
            expect(result.every(t => !t.completed)).toBe(true);
            expect(result.length).toBe(state.todos.filter(t => !t.completed).length);
          } else if (filter === 'completed') {
            expect(result.every(t => t.completed)).toBe(true);
            expect(result.length).toBe(state.todos.filter(t => t.completed).length);
          }
          resetState();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Task 5.2 & 5.3: Property-Based Tests (todo-description-validation) ──────

// Arbitrary for invalid titles: empty, too short (trimmed < 3), or too long (trimmed > 50)
const invalidTitleArb = fc.oneof(
  // Empty / whitespace-only
  fc.stringOf(fc.constantFrom(' ', '\t', '\n')),
  // Too short: trimmed length 1–2
  fc.string({ minLength: 1, maxLength: 2 }).filter(s => s.trim().length >= 1 && s.trim().length <= 2),
  // Too long: trimmed length > 50
  fc.string({ minLength: 51, maxLength: 100 }).filter(s => s.trim().length > 50),
);

// Arbitrary for valid titles: trimmed length exactly 3–50
const validTitleArb = fc.string({ minLength: 3, maxLength: 50 }).filter(s => s.trim().length >= 3 && s.trim().length <= 50);

// Feature: todo-description-validation, Property 3: Input invalid tidak mengubah todo list
describe('Property 3 (todo-description-validation): Input invalid tidak mengubah todo list', () => {
  it('editTodo dengan input invalid tidak mengubah isi todo list', () => {
    /**
     * Validates: Requirements 2.1, 2.2, 2.3, 3.1, 3.2, 3.3
     *
     * For any todo list and invalid input string, calling editTodo SHALL NOT
     * change the contents of the todo list.
     */
    fc.assert(
      fc.property(
        fc.array(todoArb, { minLength: 1 }),
        fc.integer({ min: 0 }),
        invalidTitleArb,
        (todos, idx, invalidTitle) => {
          seedTodos(todos);
          const target = state.todos[idx % state.todos.length];
          const originalTitle = target.title;
          const snapshotBefore = state.todos.map(t => ({ ...t }));

          editTodo(target.id, invalidTitle);

          // The targeted todo's title must not change
          const after = state.todos.find(t => t.id === target.id);
          expect(after.title).toBe(originalTitle);

          // The list length must not change
          expect(state.todos.length).toBe(snapshotBefore.length);

          // All other todos must remain unchanged
          for (const original of snapshotBefore) {
            const current = state.todos.find(t => t.id === original.id);
            expect(current).toBeDefined();
            expect(current.title).toBe(original.title);
            expect(current.completed).toBe(original.completed);
          }

          resetState();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: todo-description-validation, Property 4: Input valid menghasilkan todo tersimpan dengan deskripsi yang benar
describe('Property 4 (todo-description-validation): Input valid menghasilkan todo tersimpan dengan deskripsi yang benar', () => {
  it('addTodo dengan input valid (trimmed 3–50) menghasilkan todo dengan title = nilai setelah trim', () => {
    /**
     * Validates: Requirements 2.4, 3.4, 5.2
     *
     * For any string with trimmed length between 3 and 50 characters,
     * adding a todo with the trimmed value SHALL result in a new todo in the
     * list with title equal to the trimmed value.
     */
    fc.assert(
      fc.property(
        fc.array(todoArb),
        validTitleArb,
        (todos, validTitle) => {
          seedTodos(todos);
          const trimmedTitle = validTitle.trim();
          const before = state.todos.length;

          // app.js trims before calling addTodo, so we simulate that here
          const newTodo = addTodo(trimmedTitle);

          // A new todo must be added
          expect(state.todos.length).toBe(before + 1);

          // The new todo must have the correct title (trimmed value)
          expect(newTodo.title).toBe(trimmedTitle);
          expect(state.todos.find(t => t.id === newTodo.id)).toBeDefined();
          expect(state.todos.find(t => t.id === newTodo.id).title).toBe(trimmedTitle);

          resetState();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('editTodo dengan input valid (trimmed 3–50) memperbarui title todo', () => {
    /**
     * Validates: Requirements 3.4, 5.2
     *
     * For any todo and valid title string, calling editTodo SHALL update
     * the todo's title to the new value.
     */
    fc.assert(
      fc.property(
        fc.array(todoArb, { minLength: 1 }),
        fc.integer({ min: 0 }),
        validTitleArb,
        (todos, idx, validTitle) => {
          seedTodos(todos);
          const target = state.todos[idx % state.todos.length];
          const trimmedTitle = validTitle.trim();

          // app.js trims before calling editTodo, so we simulate that here
          editTodo(target.id, trimmedTitle);

          const after = state.todos.find(t => t.id === target.id);
          expect(after.title).toBe(trimmedTitle);

          resetState();
        }
      ),
      { numRuns: 100 }
    );
  });
});
