// storage.js
// Modul untuk persistensi data menggunakan localStorage

const STORAGE_KEY = 'todolist-app-todos';

/**
 * Menyimpan array todos ke localStorage.
 * Gagal secara silent jika localStorage tidak tersedia atau quota terlampaui.
 * 
 * @param {Array<Object>} todos - Array objek todo yang akan disimpan
 * @returns {void}
 * 
 * @example
 * save([{ id: '1', title: 'Belajar JS', completed: false, createdAt: 1234567890 }])
 */
export function save(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    // localStorage unavailable atau quota exceeded — fail silently
    console.warn('Failed to save to localStorage:', error.message);
  }
}

/**
 * Memuat array todos dari localStorage.
 * Mengembalikan array kosong jika:
 * - Key tidak ada
 * - localStorage tidak tersedia
 * - Data JSON corrupt
 * 
 * @returns {Array<Object>} Array objek todo, atau array kosong jika gagal
 * 
 * @example
 * const todos = load()
 * // Returns: [{ id: '1', title: 'Belajar JS', completed: false, createdAt: 1234567890 }]
 */
export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to load from localStorage:', error.message);
    return [];
  }
}
