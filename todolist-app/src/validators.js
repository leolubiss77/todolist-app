// validators.js
// Modul untuk validasi input pengguna

/**
 * Hasil validasi input
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - true jika input valid, false jika tidak
 * @property {string|null} error - pesan error jika tidak valid, null jika valid
 */

/**
 * Validasi judul tugas berdasarkan aturan bisnis:
 * - Tidak boleh kosong (setelah di-trim)
 * - Minimal 3 karakter
 * - Maksimal 50 karakter
 * 
 * @param {string} title - Judul tugas yang akan divalidasi
 * @returns {ValidationResult} Objek hasil validasi
 * 
 * @example
 * validateTitle('Belajar JavaScript')
 * // Returns: { valid: true, error: null }
 * 
 * @example
 * validateTitle('')
 * // Returns: { valid: false, error: 'Judul tugas tidak boleh kosong.' }
 */
export function validateTitle(title) {
  const trimmed = title.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Judul tugas tidak boleh kosong.' };
  }
  
  if (trimmed.length < 3) {
    return { valid: false, error: 'Judul tugas minimal 3 karakter.' };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: 'Judul tugas maksimal 50 karakter.' };
  }
  
  return { valid: true, error: null };
}

/**
 * Wrapper untuk backward compatibility.
 * Mengembalikan boolean untuk validasi sederhana.
 * 
 * @param {string} title - Judul tugas yang akan divalidasi
 * @returns {boolean} true jika valid, false jika tidak
 * @deprecated Gunakan validateTitle() untuk mendapatkan pesan error
 * 
 * @example
 * isValidTitle('Belajar JavaScript')
 * // Returns: true
 */
export function isValidTitle(title) {
  return validateTitle(title).valid;
}
