import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { save, load } from '../src/storage.js';

// --- Unit Tests (Task 3.2) ---
// Requirements: 8.3, 8.4

const STORAGE_KEY = 'todolist-app-todos';

/** Creates a simple in-memory localStorage mock */
function createLocalStorageMock() {
  const store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createLocalStorageMock());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('storage - normal save & load', () => {
  it('load returns [] when nothing is stored', () => {
    expect(load()).toEqual([]);
  });

  it('save then load returns the same array', () => {
    const todos = [
      { id: '1', title: 'Buy milk', completed: false, createdAt: 1000 },
      { id: '2', title: 'Walk dog', completed: true, createdAt: 2000 },
    ];
    save(todos);
    expect(load()).toEqual(todos);
  });

  it('save overwrites previous data', () => {
    save([{ id: '1', title: 'Old', completed: false, createdAt: 1 }]);
    const updated = [{ id: '2', title: 'New', completed: true, createdAt: 2 }];
    save(updated);
    expect(load()).toEqual(updated);
  });

  it('save with empty array stores and loads back []', () => {
    save([]);
    expect(load()).toEqual([]);
  });
});

describe('storage - localStorage unavailable', () => {
  it('load returns [] when localStorage throws on getItem', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('unavailable'); },
      setItem: () => { throw new Error('unavailable'); },
    });
    expect(load()).toEqual([]);
  });

  it('save does not throw when localStorage throws on setItem', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => { throw new Error('quota exceeded'); },
    });
    expect(() => save([{ id: '1', title: 'Test', completed: false, createdAt: 1 }])).not.toThrow();
  });
});

describe('storage - corrupt JSON', () => {
  it('load returns [] when stored value is not valid JSON', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => 'not-valid-json{{{',
    });
    expect(load()).toEqual([]);
  });

  it('load returns [] when stored value is a bare string', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => 'hello',
    });
    expect(load()).toEqual([]);
  });
});

// --- Property-Based Test (Task 3.3) ---
// Feature: todolist-app, Property 5: storage round-trip
// Validates: Requirements 8.2, 8.4, 1.5

const todoArb = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  completed: fc.boolean(),
  createdAt: fc.integer({ min: 0 }),
});

describe('Property 5: Storage data round-trip', () => {
  it('save then load produces a structurally equivalent array for any valid todos', () => {
    fc.assert(
      fc.property(fc.array(todoArb), (todos) => {
        // Fresh mock for each run
        vi.stubGlobal('localStorage', createLocalStorageMock());
        save(todos);
        const loaded = load();
        expect(loaded).toEqual(todos);
      }),
      { numRuns: 100 }
    );
  });
});
