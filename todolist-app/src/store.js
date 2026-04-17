// store.js
// Modul untuk state management dan business logic aplikasi

import { validateTitle } from './validators.js';

/**
 * Objek Todo
 * @typedef {Object} Todo
 * @property {string} id - ID unik todo
 * @property {string} title - Judul todo
 * @property {boolean} completed - Status selesai/belum
 * @property {number} createdAt - Timestamp pembuatan (milliseconds)
 */

/**
 * Global state aplikasi.
 * Single source of truth untuk semua data todo dan filter aktif.
 * 
 * @type {{ todos: Array<Todo>, filter: 'all' | 'active' | 'completed' }}
 */
export const state = {
  todos: [],
  filter: 'all',
};

/**
 * Reset state ke nilai awal.
 * Berguna untuk testing atau clear semua data.
 * 
 * @returns {void}
 */
export function resetState() {
  state.todos = [];
  state.filter = 'all';
}

/**
 * Generate ID unik menggunakan crypto.randomUUID() jika tersedia,
 * fallback ke timestamp + random jika tidak.
 * 
 * @returns {string} ID unik
 * @private
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return String(Date.now() + Math.random());
}

/**
 * Menambahkan todo baru ke state.
 * Todo akan otomatis mendapat ID unik, timestamp, dan status completed=false.
 * 
 * @param {string} title - Judul todo (akan di-trim otomatis)
 * @returns {Todo} Objek todo yang baru dibuat
 * 
 * @example
 * const todo = addTodo('Belajar JavaScript')
 * // Returns: { id: 'uuid', title: 'Belajar JavaScript', completed: false, createdAt: 1234567890 }
 */
export function addTodo(title) {
  const todo = {
    id: generateId(),
    title,
    completed: false,
    createdAt: Date.now(),
  };
  state.todos.push(todo);
  return todo;
}

/**
 * Toggle status completed dari todo berdasarkan ID.
 * Jika todo tidak ditemukan, tidak ada yang terjadi.
 * 
 * @param {string} id - ID todo yang akan di-toggle
 * @returns {void}
 * 
 * @example
 * toggleTodo('uuid-123')
 * // Todo dengan id 'uuid-123' akan berubah status completed-nya
 */
export function toggleTodo(id) {
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
}

/**
 * Menghapus todo berdasarkan ID.
 * Jika todo tidak ditemukan, tidak ada yang terjadi.
 * 
 * @param {string} id - ID todo yang akan dihapus
 * @returns {void}
 * 
 * @example
 * deleteTodo('uuid-123')
 * // Todo dengan id 'uuid-123' akan dihapus dari state
 */
export function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
}

/**
 * Mengubah judul todo berdasarkan ID.
 * Hanya akan mengubah jika newTitle valid (melewati validasi).
 * Jika todo tidak ditemukan atau validasi gagal, tidak ada yang terjadi.
 * 
 * @param {string} id - ID todo yang akan diedit
 * @param {string} newTitle - Judul baru
 * @returns {void}
 * 
 * @example
 * editTodo('uuid-123', 'Belajar TypeScript')
 * // Todo dengan id 'uuid-123' akan berubah judulnya
 */
export function editTodo(id, newTitle) {
  if (!validateTitle(newTitle).valid) return;
  const todo = state.todos.find(t => t.id === id);
  if (todo) {
    todo.title = newTitle;
  }
}

/**
 * Menghapus semua todo yang sudah selesai (completed=true).
 * 
 * @returns {void}
 * 
 * @example
 * clearCompleted()
 * // Semua todo dengan completed=true akan dihapus
 */
export function clearCompleted() {
  state.todos = state.todos.filter(t => !t.completed);
}

/**
 * Mengatur filter aktif untuk menampilkan todo.
 * 
 * @param {'all' | 'active' | 'completed'} filter - Filter yang akan diaktifkan
 * @returns {void}
 * 
 * @example
 * setFilter('active')
 * // Filter akan diset ke 'active', hanya menampilkan todo yang belum selesai
 */
export function setFilter(filter) {
  state.filter = filter;
}

/**
 * Mengembalikan array todos yang sudah difilter berdasarkan filter aktif.
 * - 'all': semua todo
 * - 'active': hanya todo yang belum selesai
 * - 'completed': hanya todo yang sudah selesai
 * 
 * @returns {Array<Todo>} Array todo yang sudah difilter
 * 
 * @example
 * setFilter('active')
 * const activeTodos = getFilteredTodos()
 * // Returns: array todo dengan completed=false
 */
export function getFilteredTodos() {
  if (state.filter === 'active') {
    return state.todos.filter(t => !t.completed);
  }
  if (state.filter === 'completed') {
    return state.todos.filter(t => t.completed);
  }
  return state.todos;
}
