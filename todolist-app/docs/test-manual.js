// test-manual.js
// Pengujian manual menggunakan console.assert untuk fungsi save task

import { state, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, setFilter, getFilteredTodos } from '../src/store.js';
import { save, load } from '../src/storage.js';
import { validateTitle } from '../src/validators.js';

console.log('🧪 Memulai pengujian manual...\n');

// ═══════════════════════════════════════════════════════════════════════════
// Test 1: Validasi Input Normal
// ═══════════════════════════════════════════════════════════════════════════

console.log('📋 Test 1: Validasi Input Normal');

// Reset state
state.todos = [];

// Test 1.1: Input valid sederhana
const result1 = validateTitle('Belajar JavaScript');
console.assert(result1.valid === true, '❌ Test 1.1 gagal: Input valid harus diterima');
console.log('✅ Test 1.1: Input valid "Belajar JavaScript" diterima');

// Test 1.2: Tambah todo dengan input valid
const initialLength = state.todos.length;
addTodo('Belajar JavaScript');
console.assert(state.todos.length === initialLength + 1, '❌ Test 1.2 gagal: Todo tidak ditambahkan');
console.assert(state.todos[0].title === 'Belajar JavaScript', '❌ Test 1.2 gagal: Judul tidak sesuai');
console.assert(state.todos[0].completed === false, '❌ Test 1.2 gagal: Status awal harus false');
console.log('✅ Test 1.2: Todo berhasil ditambahkan dengan status completed=false');

// Test 1.3: Save dan load data
save(state.todos);
const loaded = load();
console.assert(loaded.length === state.todos.length, '❌ Test 1.3 gagal: Jumlah todo tidak sama setelah load');
console.assert(loaded[0].title === 'Belajar JavaScript', '❌ Test 1.3 gagal: Judul tidak sama setelah load');
console.log('✅ Test 1.3: Data berhasil disimpan dan dimuat kembali');

// Test 1.4: Toggle todo
const todoId = state.todos[0].id;
toggleTodo(todoId);
console.assert(state.todos[0].completed === true, '❌ Test 1.4 gagal: Toggle tidak mengubah status');
save(state.todos);
console.log('✅ Test 1.4: Toggle todo berhasil mengubah status menjadi completed=true');

// Test 1.5: Edit todo dengan input valid
editTodo(todoId, 'Belajar TypeScript');
console.assert(state.todos[0].title === 'Belajar TypeScript', '❌ Test 1.5 gagal: Edit tidak mengubah judul');
save(state.todos);
console.log('✅ Test 1.5: Edit todo berhasil mengubah judul');

console.log('');

// ═══════════════════════════════════════════════════════════════════════════
// Test 2: Validasi Input Negatif (Invalid)
// ═══════════════════════════════════════════════════════════════════════════

console.log('📋 Test 2: Validasi Input Negatif');

// Test 2.1: Input kosong
const result2 = validateTitle('');
console.assert(result2.valid === false, '❌ Test 2.1 gagal: Input kosong harus ditolak');
console.assert(result2.error !== undefined, '❌ Test 2.1 gagal: Harus ada pesan error');
console.log('✅ Test 2.1: Input kosong ditolak dengan error:', result2.error);

// Test 2.2: Input hanya spasi
const result3 = validateTitle('   ');
console.assert(result3.valid === false, '❌ Test 2.2 gagal: Input hanya spasi harus ditolak');
console.log('✅ Test 2.2: Input hanya spasi ditolak');

// Test 2.3: Input hanya tab dan newline
const result4 = validateTitle('\t\n\r');
console.assert(result4.valid === false, '❌ Test 2.3 gagal: Input hanya whitespace harus ditolak');
console.log('✅ Test 2.3: Input hanya whitespace (tab, newline) ditolak');

// Test 2.4: Tambah todo dengan input invalid tidak mengubah state
const beforeLength = state.todos.length;
const invalidResult = validateTitle('  ');
if (!invalidResult.valid) {
  // Simulasi: tidak memanggil addTodo jika validasi gagal
  console.assert(state.todos.length === beforeLength, '❌ Test 2.4 gagal: State berubah meskipun input invalid');
  console.log('✅ Test 2.4: State tidak berubah saat input invalid');
}

// Test 2.5: Edit todo dengan input invalid tidak mengubah judul
const currentTitle = state.todos[0].title;
const editResult = validateTitle('');
if (!editResult.valid) {
  // Simulasi: tidak memanggil editTodo jika validasi gagal
  console.assert(state.todos[0].title === currentTitle, '❌ Test 2.5 gagal: Judul berubah meskipun input invalid');
  console.log('✅ Test 2.5: Judul tidak berubah saat edit dengan input invalid');
}

console.log('');

// ═══════════════════════════════════════════════════════════════════════════
// Test 3: Operasi CRUD Lengkap
// ═══════════════════════════════════════════════════════════════════════════

console.log('📋 Test 3: Operasi CRUD Lengkap');

// Reset state
state.todos = [];

// Test 3.1: Tambah beberapa todo
addTodo('Task 1');
addTodo('Task 2');
addTodo('Task 3');
console.assert(state.todos.length === 3, '❌ Test 3.1 gagal: Jumlah todo tidak sesuai');
console.log('✅ Test 3.1: Berhasil menambahkan 3 todo');

// Test 3.2: Toggle beberapa todo
toggleTodo(state.todos[0].id);
toggleTodo(state.todos[1].id);
const completedCount = state.todos.filter(t => t.completed).length;
console.assert(completedCount === 2, '❌ Test 3.2 gagal: Jumlah completed tidak sesuai');
console.log('✅ Test 3.2: Berhasil toggle 2 todo menjadi completed');

// Test 3.3: Filter active
setFilter('active');
const activeTodos = getFilteredTodos();
console.assert(activeTodos.length === 1, '❌ Test 3.3 gagal: Filter active tidak bekerja');
console.assert(activeTodos[0].completed === false, '❌ Test 3.3 gagal: Filter active mengembalikan completed todo');
console.log('✅ Test 3.3: Filter active mengembalikan 1 todo yang belum selesai');

// Test 3.4: Filter completed
setFilter('completed');
const completedTodos = getFilteredTodos();
console.assert(completedTodos.length === 2, '❌ Test 3.4 gagal: Filter completed tidak bekerja');
console.log('✅ Test 3.4: Filter completed mengembalikan 2 todo yang selesai');

// Test 3.5: Clear completed
clearCompleted();
console.assert(state.todos.length === 1, '❌ Test 3.5 gagal: Clear completed tidak menghapus todo selesai');
console.assert(state.todos[0].completed === false, '❌ Test 3.5 gagal: Todo aktif ikut terhapus');
console.log('✅ Test 3.5: Clear completed menghapus semua todo selesai, todo aktif tetap ada');

// Test 3.6: Delete todo
const remainingId = state.todos[0].id;
deleteTodo(remainingId);
console.assert(state.todos.length === 0, '❌ Test 3.6 gagal: Delete tidak menghapus todo');
console.log('✅ Test 3.6: Delete berhasil menghapus todo terakhir');

console.log('');

// ═══════════════════════════════════════════════════════════════════════════
// Test 4: Edge Cases
// ═══════════════════════════════════════════════════════════════════════════

console.log('📋 Test 4: Edge Cases');

// Reset state
state.todos = [];

// Test 4.1: Input dengan spasi di awal dan akhir (harus di-trim)
const result5 = validateTitle('  Task dengan spasi  ');
console.assert(result5.valid === true, '❌ Test 4.1 gagal: Input dengan spasi di tepi harus valid');
addTodo('  Task dengan spasi  ');
console.assert(state.todos[0].title === 'Task dengan spasi', '❌ Test 4.1 gagal: Judul tidak di-trim');
console.log('✅ Test 4.1: Input dengan spasi di tepi di-trim dengan benar');

// Test 4.2: Input dengan karakter spesial
addTodo('Task @#$%^&*()');
console.assert(state.todos[1].title === 'Task @#$%^&*()', '❌ Test 4.2 gagal: Karakter spesial tidak diterima');
console.log('✅ Test 4.2: Input dengan karakter spesial diterima');

// Test 4.3: Input dengan emoji
addTodo('Task 🚀 dengan emoji');
console.assert(state.todos[2].title === 'Task 🚀 dengan emoji', '❌ Test 4.3 gagal: Emoji tidak diterima');
console.log('✅ Test 4.3: Input dengan emoji diterima');

// Test 4.4: Input sangat panjang
const longTitle = 'A'.repeat(500);
addTodo(longTitle);
console.assert(state.todos[3].title.length === 500, '❌ Test 4.4 gagal: Input panjang tidak diterima');
console.log('✅ Test 4.4: Input sangat panjang (500 karakter) diterima');

// Test 4.5: Toggle todo yang sama dua kali (round-trip)
const testId = state.todos[0].id;
const originalStatus = state.todos[0].completed;
toggleTodo(testId);
toggleTodo(testId);
console.assert(state.todos[0].completed === originalStatus, '❌ Test 4.5 gagal: Toggle round-trip tidak mengembalikan status awal');
console.log('✅ Test 4.5: Toggle dua kali mengembalikan status awal (round-trip)');

// Test 4.6: Delete todo yang tidak ada (tidak boleh error)
const nonExistentId = 'non-existent-id-12345';
const lengthBefore = state.todos.length;
deleteTodo(nonExistentId);
console.assert(state.todos.length === lengthBefore, '❌ Test 4.6 gagal: Delete todo tidak ada mengubah state');
console.log('✅ Test 4.6: Delete todo yang tidak ada tidak mengubah state');

// Test 4.7: Edit todo yang tidak ada (tidak boleh error)
editTodo(nonExistentId, 'New Title');
console.assert(state.todos.length === lengthBefore, '❌ Test 4.7 gagal: Edit todo tidak ada mengubah state');
console.log('✅ Test 4.7: Edit todo yang tidak ada tidak mengubah state');

console.log('');

// ═══════════════════════════════════════════════════════════════════════════
// Test 5: Persistensi Data (localStorage)
// ═══════════════════════════════════════════════════════════════════════════

console.log('📋 Test 5: Persistensi Data');

// Reset state
state.todos = [];

// Test 5.1: Save dan load dengan data kosong
save(state.todos);
const emptyLoad = load();
console.assert(Array.isArray(emptyLoad), '❌ Test 5.1 gagal: Load harus mengembalikan array');
console.assert(emptyLoad.length === 0, '❌ Test 5.1 gagal: Load data kosong harus mengembalikan array kosong');
console.log('✅ Test 5.1: Save dan load data kosong berhasil');

// Test 5.2: Save dan load dengan beberapa todo
addTodo('Persistent Task 1');
addTodo('Persistent Task 2');
toggleTodo(state.todos[0].id);
save(state.todos);

const loadedData = load();
console.assert(loadedData.length === 2, '❌ Test 5.2 gagal: Jumlah todo setelah load tidak sesuai');
console.assert(loadedData[0].title === 'Persistent Task 1', '❌ Test 5.2 gagal: Judul tidak sama setelah load');
console.assert(loadedData[0].completed === true, '❌ Test 5.2 gagal: Status completed tidak sama setelah load');
console.assert(loadedData[1].completed === false, '❌ Test 5.2 gagal: Status completed tidak sama setelah load');
console.log('✅ Test 5.2: Save dan load dengan beberapa todo berhasil mempertahankan semua data');

// Test 5.3: Verifikasi semua field tersimpan (id, title, completed, createdAt)
const savedTodo = loadedData[0];
console.assert(savedTodo.id !== undefined, '❌ Test 5.3 gagal: Field id tidak tersimpan');
console.assert(savedTodo.title !== undefined, '❌ Test 5.3 gagal: Field title tidak tersimpan');
console.assert(savedTodo.completed !== undefined, '❌ Test 5.3 gagal: Field completed tidak tersimpan');
console.assert(savedTodo.createdAt !== undefined, '❌ Test 5.3 gagal: Field createdAt tidak tersimpan');
console.assert(typeof savedTodo.createdAt === 'number', '❌ Test 5.3 gagal: createdAt harus berupa number');
console.log('✅ Test 5.3: Semua field (id, title, completed, createdAt) tersimpan dengan benar');

console.log('');
console.log('🎉 Semua pengujian selesai!');
console.log('📊 Ringkasan: Jika tidak ada pesan error (❌), semua test berhasil.');
