// app.js

import { state, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, setFilter, getFilteredTodos } from './store.js';
import { save, load } from './storage.js';
import { renderTodos, renderFilters, renderClearButton, showValidationMessage } from './render.js';
import { validateTitle } from './validators.js';

// ─── Task 9.1: Initialize app on page load ───────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  state.todos = load();
  renderTodos(getFilteredTodos());
  renderFilters(state.filter);
  renderClearButton(state.todos);
});

// ─── Task 9.2: Add todo event handler ────────────────────────────────────────

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const validationMsg = document.getElementById('validation-message');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  handleAddTodo();
});

function handleAddTodo() {
  const title = input.value;
  const result = validateTitle(title);
  if (!result.valid) {
    showValidationMessage(validationMsg, result.error);
    return;
  }
  addTodo(title.trim());
  save(state.todos);
  renderTodos(getFilteredTodos());
  renderClearButton(state.todos);
  input.value = '';
}

// ─── Task 9.3: Toggle, delete, and filter event handlers ─────────────────────

const todoList = document.getElementById('todo-list');

todoList.addEventListener('click', (e) => {
  const target = e.target;
  const action = target.dataset.action;
  const id = target.dataset.id;

  if (action === 'toggle') {
    toggleTodo(id);
    save(state.todos);
    renderTodos(getFilteredTodos());
    renderClearButton(state.todos);
  } else if (action === 'delete') {
    deleteTodo(id);
    save(state.todos);
    renderTodos(getFilteredTodos());
    renderClearButton(state.todos);
  } else if (action === 'edit') {
    startEditing(id);
  }
});

document.getElementById('filter-buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  setFilter(btn.dataset.filter);
  renderTodos(getFilteredTodos());
  renderFilters(state.filter);
});

// ─── Task 9.4: Edit todo event handler (inline editing) ──────────────────────

function startEditing(id) {
  const todo = state.todos.find(t => t.id === id);
  if (!todo) return;

  const li = todoList.querySelector(`li[data-id="${id}"]`);
  if (!li) return;

  const titleEl = li.querySelector('.todo-title');

  // Build inline edit input
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = todo.title;
  editInput.classList.add('edit-input');

  // Build save button
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Simpan';
  saveBtn.dataset.action = 'save-edit';

  // Build cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Batal';
  cancelBtn.dataset.action = 'cancel-edit';

  // Inline validation message
  const editValidation = document.createElement('span');
  editValidation.classList.add('edit-validation');
  editValidation.hidden = true;

  // Replace title element with edit controls
  titleEl.replaceWith(editInput, editValidation, saveBtn, cancelBtn);

  editInput.focus();

  function saveEdit() {
    const newTitle = editInput.value;
    const result = validateTitle(newTitle);
    if (!result.valid) {
      showValidationMessage(editValidation, result.error);
      return;
    }
    editTodo(id, newTitle.trim());
    save(state.todos);
    renderTodos(getFilteredTodos());
  }

  function cancelEdit() {
    renderTodos(getFilteredTodos());
  }

  saveBtn.addEventListener('click', saveEdit);
  cancelBtn.addEventListener('click', cancelEdit);

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  });
}

// ─── Task 9.5: "Hapus Selesai" event handler ─────────────────────────────────

document.getElementById('clear-completed-btn').addEventListener('click', () => {
  clearCompleted();
  save(state.todos);
  renderTodos(getFilteredTodos());
  renderClearButton(state.todos);
});


// ═══════════════════════════════════════════════════════════════════════════
// Development Mode: Manual Testing
// Aktifkan dengan menambahkan ?test=true di URL
// ═══════════════════════════════════════════════════════════════════════════

if (window.location.search.includes('test=true')) {
  console.log('🧪 MODE TEST AKTIF - Menjalankan pengujian manual...\n');
  
  // Import untuk testing
  setTimeout(() => {
    runManualTests();
  }, 1000); // Delay agar DOM siap
}

function runManualTests() {
  console.log('📋 Test 1: Validasi Input Normal');
  
  // Backup state asli
  const originalTodos = [...state.todos];
  state.todos = [];
  
  // Test 1.1: Input valid
  const result1 = validateTitle('Belajar JavaScript');
  console.assert(result1.valid === true, '❌ Test 1.1 gagal: Input valid harus diterima');
  console.log('✅ Test 1.1: Input valid "Belajar JavaScript" diterima');
  
  // Test 1.2: Tambah todo
  addTodo('Belajar JavaScript');
  console.assert(state.todos.length === 1, '❌ Test 1.2 gagal: Todo tidak ditambahkan');
  console.assert(state.todos[0].completed === false, '❌ Test 1.2 gagal: Status awal harus false');
  console.log('✅ Test 1.2: Todo berhasil ditambahkan');
  
  // Test 1.3: Save dan load
  save(state.todos);
  const loaded = load();
  console.assert(loaded.length === 1, '❌ Test 1.3 gagal: Data tidak tersimpan');
  console.log('✅ Test 1.3: Data berhasil disimpan dan dimuat');
  
  console.log('\n📋 Test 2: Validasi Input Negatif');
  
  // Test 2.1: Input kosong
  const result2 = validateTitle('');
  console.assert(result2.valid === false, '❌ Test 2.1 gagal: Input kosong harus ditolak');
  console.log('✅ Test 2.1: Input kosong ditolak');
  
  // Test 2.2: Input hanya spasi
  const result3 = validateTitle('   ');
  console.assert(result3.valid === false, '❌ Test 2.2 gagal: Input spasi harus ditolak');
  console.log('✅ Test 2.2: Input hanya spasi ditolak');
  
  // Test 2.3: Input whitespace
  const result4 = validateTitle('\t\n\r');
  console.assert(result4.valid === false, '❌ Test 2.3 gagal: Whitespace harus ditolak');
  console.log('✅ Test 2.3: Input whitespace ditolak');
  
  console.log('\n📋 Test 3: Operasi CRUD');
  
  // Reset
  state.todos = [];
  
  // Test 3.1: Tambah beberapa todo
  addTodo('Task 1');
  addTodo('Task 2');
  addTodo('Task 3');
  console.assert(state.todos.length === 3, '❌ Test 3.1 gagal: Jumlah tidak sesuai');
  console.log('✅ Test 3.1: Berhasil menambahkan 3 todo');
  
  // Test 3.2: Toggle
  toggleTodo(state.todos[0].id);
  toggleTodo(state.todos[1].id);
  const completedCount = state.todos.filter(t => t.completed).length;
  console.assert(completedCount === 2, '❌ Test 3.2 gagal: Toggle tidak bekerja');
  console.log('✅ Test 3.2: Toggle 2 todo berhasil');
  
  // Test 3.3: Filter active
  setFilter('active');
  const activeTodos = getFilteredTodos();
  console.assert(activeTodos.length === 1, '❌ Test 3.3 gagal: Filter active tidak bekerja');
  console.log('✅ Test 3.3: Filter active mengembalikan 1 todo');
  
  // Test 3.4: Filter completed
  setFilter('completed');
  const completedTodos = getFilteredTodos();
  console.assert(completedTodos.length === 2, '❌ Test 3.4 gagal: Filter completed tidak bekerja');
  console.log('✅ Test 3.4: Filter completed mengembalikan 2 todo');
  
  // Test 3.5: Clear completed
  clearCompleted();
  console.assert(state.todos.length === 1, '❌ Test 3.5 gagal: Clear tidak bekerja');
  console.log('✅ Test 3.5: Clear completed berhasil');
  
  // Test 3.6: Delete
  deleteTodo(state.todos[0].id);
  console.assert(state.todos.length === 0, '❌ Test 3.6 gagal: Delete tidak bekerja');
  console.log('✅ Test 3.6: Delete berhasil');
  
  console.log('\n📋 Test 4: Edge Cases');
  
  // Test 4.1: Trim spasi
  addTodo('  Task dengan spasi  ');
  console.assert(state.todos[0].title === 'Task dengan spasi', '❌ Test 4.1 gagal: Tidak di-trim');
  console.log('✅ Test 4.1: Input di-trim dengan benar');
  
  // Test 4.2: Karakter spesial
  addTodo('Task @#$%^&*()');
  console.assert(state.todos[1].title === 'Task @#$%^&*()', '❌ Test 4.2 gagal: Karakter spesial ditolak');
  console.log('✅ Test 4.2: Karakter spesial diterima');
  
  // Test 4.3: Emoji
  addTodo('Task 🚀 emoji');
  console.assert(state.todos[2].title === 'Task 🚀 emoji', '❌ Test 4.3 gagal: Emoji ditolak');
  console.log('✅ Test 4.3: Emoji diterima');
  
  // Test 4.4: Toggle round-trip
  const testId = state.todos[0].id;
  const originalStatus = state.todos[0].completed;
  toggleTodo(testId);
  toggleTodo(testId);
  console.assert(state.todos[0].completed === originalStatus, '❌ Test 4.4 gagal: Round-trip gagal');
  console.log('✅ Test 4.4: Toggle round-trip berhasil');
  
  console.log('\n📋 Test 5: Persistensi Data');
  
  // Test 5.1: Save dan load
  save(state.todos);
  const loadedData = load();
  console.assert(loadedData.length === state.todos.length, '❌ Test 5.1 gagal: Data tidak sama');
  console.log('✅ Test 5.1: Save dan load berhasil');
  
  // Test 5.2: Semua field tersimpan
  const savedTodo = loadedData[0];
  console.assert(savedTodo.id !== undefined, '❌ Test 5.2 gagal: id tidak tersimpan');
  console.assert(savedTodo.title !== undefined, '❌ Test 5.2 gagal: title tidak tersimpan');
  console.assert(savedTodo.completed !== undefined, '❌ Test 5.2 gagal: completed tidak tersimpan');
  console.assert(savedTodo.createdAt !== undefined, '❌ Test 5.2 gagal: createdAt tidak tersimpan');
  console.log('✅ Test 5.2: Semua field tersimpan dengan benar');
  
  console.log('\n🎉 Semua pengujian selesai!');
  console.log('📊 Jika tidak ada ❌, semua test LULUS');
  
  // Restore state asli
  state.todos = originalTodos;
  setFilter('all');
  renderTodos(getFilteredTodos());
  renderFilters(state.filter);
  renderClearButton(state.todos);
  
  console.log('\n💡 State aplikasi dikembalikan ke kondisi awal');
}
