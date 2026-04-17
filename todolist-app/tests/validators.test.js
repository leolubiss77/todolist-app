import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { isValidTitle, validateTitle } from '../src/validators.js';

// --- Unit Tests (Task 1.1) ---
// Requirements: 1.1, 1.2, 1.3, 1.4, 5.1

describe('validateTitle', () => {
  it('string kosong → { valid: false, error: "Judul tugas tidak boleh kosong." }', () => {
    expect(validateTitle('')).toEqual({ valid: false, error: 'Judul tugas tidak boleh kosong.' });
  });

  it('whitespace-only → { valid: false, error: "Judul tugas tidak boleh kosong." }', () => {
    expect(validateTitle('   ')).toEqual({ valid: false, error: 'Judul tugas tidak boleh kosong.' });
  });

  it('1 karakter → { valid: false, error: "Judul tugas minimal 3 karakter." }', () => {
    expect(validateTitle('a')).toEqual({ valid: false, error: 'Judul tugas minimal 3 karakter.' });
  });

  it('2 karakter → { valid: false, error: "Judul tugas minimal 3 karakter." }', () => {
    expect(validateTitle('ab')).toEqual({ valid: false, error: 'Judul tugas minimal 3 karakter.' });
  });

  it('3 karakter (batas bawah) → { valid: true, error: null }', () => {
    expect(validateTitle('abc')).toEqual({ valid: true, error: null });
  });

  it('50 karakter (batas atas) → { valid: true, error: null }', () => {
    expect(validateTitle('a'.repeat(50))).toEqual({ valid: true, error: null });
  });

  it('51 karakter → { valid: false, error: "Judul tugas maksimal 50 karakter." }', () => {
    expect(validateTitle('a'.repeat(51))).toEqual({ valid: false, error: 'Judul tugas maksimal 50 karakter.' });
  });

  it('"  ab  " (trimmed = 2) → { valid: false, error: "Judul tugas minimal 3 karakter." }', () => {
    expect(validateTitle('  ab  ')).toEqual({ valid: false, error: 'Judul tugas minimal 3 karakter.' });
  });

  it('"  abc  " (trimmed = 3) → { valid: true, error: null }', () => {
    expect(validateTitle('  abc  ')).toEqual({ valid: true, error: null });
  });
});

// --- Backward Compatibility Tests (Task 1.1) ---
// Requirements: 5.1

describe('isValidTitle (backward compat)', () => {
  it('isValidTitle("abc") → true', () => {
    expect(isValidTitle('abc')).toBe(true);
  });

  it('isValidTitle("ab") → false', () => {
    expect(isValidTitle('ab')).toBe(false);
  });

  it('returns true for a normal string', () => {
    expect(isValidTitle('Buy milk')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(isValidTitle('')).toBe(false);
  });

  it('returns false for a string with only spaces', () => {
    expect(isValidTitle('   ')).toBe(false);
  });

  it('returns false for a string with only tabs', () => {
    expect(isValidTitle('\t\t')).toBe(false);
  });

  it('returns false for a string with only newlines', () => {
    expect(isValidTitle('\n\n')).toBe(false);
  });

  it('returns false for a mixed whitespace-only string', () => {
    expect(isValidTitle(' \t\n ')).toBe(false);
  });
});

// --- Property-Based Tests (Task 1.2) ---
// Feature: todo-description-validation, Property 1: batas panjang validator konsisten
// Validates: Requirements 1.1, 1.2, 1.3, 1.4

describe('Property 1: Batas panjang validator konsisten', () => {
  it('string dengan trimmed length < 3 → valid: false', () => {
    // Generate string dengan trimmed length 1 atau 2 (bukan whitespace-only)
    const shortStringArb = fc.oneof(
      // Exactly 1 non-whitespace char (possibly with surrounding whitespace)
      fc.tuple(
        fc.string({ unit: 'grapheme' }).filter((s) => s.trim().length === 0),
        fc.string({ unit: 'grapheme', minLength: 1, maxLength: 1 }).filter((s) => s.trim().length === 1),
        fc.string({ unit: 'grapheme' }).filter((s) => s.trim().length === 0),
      ).map(([pre, mid, post]) => pre + mid + post),
      // Exactly 2 non-whitespace chars (possibly with surrounding whitespace)
      fc.tuple(
        fc.string({ unit: 'grapheme' }).filter((s) => s.trim().length === 0),
        fc.string({ unit: 'grapheme', minLength: 2, maxLength: 2 }).filter((s) => s.trim().length === 2),
        fc.string({ unit: 'grapheme' }).filter((s) => s.trim().length === 0),
      ).map(([pre, mid, post]) => pre + mid + post),
    );

    fc.assert(
      fc.property(shortStringArb, (title) => {
        const result = validateTitle(title);
        return result.valid === false;
      }),
      { numRuns: 100 }
    );
  });

  it('string dengan trimmed length > 50 → valid: false', () => {
    const longStringArb = fc
      .string({ unit: 'grapheme', minLength: 51 })
      .filter((s) => s.trim().length > 50);

    fc.assert(
      fc.property(longStringArb, (title) => {
        const result = validateTitle(title);
        return result.valid === false;
      }),
      { numRuns: 100 }
    );
  });

  it('string dengan trimmed length 3–50 → valid: true', () => {
    const validStringArb = fc
      .string({ unit: 'grapheme', minLength: 3, maxLength: 50 })
      .filter((s) => s.trim().length >= 3 && s.trim().length <= 50);

    fc.assert(
      fc.property(validStringArb, (title) => {
        const result = validateTitle(title);
        return result.valid === true && result.error === null;
      }),
      { numRuns: 100 }
    );
  });
});

// --- Property-Based Tests (Task 1.3) ---
// Feature: todo-description-validation, Property 2: whitespace-only selalu ditolak dengan pesan kosong
// Validates: Requirements 1.1, 2.1, 3.1, 5.1

describe('Property 2: Whitespace-only selalu ditolak dengan pesan kosong', () => {
  it('whitespace-only string → valid: false dan error === "Judul tugas tidak boleh kosong."', () => {
    const whitespaceArb = fc
      .string({ unit: 'grapheme', minLength: 1 })
      .filter((s) => s.trim().length === 0);

    fc.assert(
      fc.property(whitespaceArb, (title) => {
        const result = validateTitle(title);
        return result.valid === false && result.error === 'Judul tugas tidak boleh kosong.';
      }),
      { numRuns: 100 }
    );
  });
});
