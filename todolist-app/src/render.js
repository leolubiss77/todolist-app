// render.js
// Modul untuk rendering UI dan manipulasi DOM

/**
 * Objek Todo
 * @typedef {Object} Todo
 * @property {string} id - ID unik todo
 * @property {string} title - Judul todo
 * @property {boolean} completed - Status selesai/belum
 * @property {number} createdAt - Timestamp pembuatan
 */

/**
 * Me-render ulang daftar todo ke DOM.
 * Todo akan diurutkan descending berdasarkan createdAt (terbaru di atas).
 * Menampilkan pesan kosong jika tidak ada todo.
 * 
 * @param {Array<Todo>} todos - Array todo yang akan di-render
 * @returns {void}
 * 
 * @example
 * renderTodos([
 *   { id: '1', title: 'Task 1', completed: false, createdAt: 1234567890 }
 * ])
 */
export function renderTodos(todos) {
  const list = document.getElementById('todo-list');
  const emptyMsg = document.getElementById('empty-message');

  // Urutkan descending berdasarkan createdAt (terbaru pertama)
  const sorted = [...todos].sort((a, b) => b.createdAt - a.createdAt);

  list.innerHTML = '';

  if (sorted.length === 0) {
    emptyMsg.hidden = false;
    return;
  }

  emptyMsg.hidden = true;

  for (const todo of sorted) {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    if (todo.completed) {
      li.classList.add('completed');
    }

    // Checkbox untuk toggle
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.dataset.action = 'toggle';
    checkbox.dataset.id = todo.id;
    checkbox.setAttribute('aria-label', `Tandai ${todo.title} sebagai ${todo.completed ? 'belum selesai' : 'selesai'}`);

    // Content wrapper
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('todo-content');

    // Title
    const titleEl = document.createElement('span');
    titleEl.classList.add('todo-title');
    if (todo.completed) {
      const s = document.createElement('s');
      s.textContent = todo.title;
      titleEl.appendChild(s);
    } else {
      titleEl.textContent = todo.title;
    }

    // Creation time
    const timeEl = document.createElement('span');
    timeEl.classList.add('todo-time');
    timeEl.textContent = new Date(todo.createdAt).toLocaleString('id-ID');

    contentDiv.appendChild(titleEl);
    contentDiv.appendChild(timeEl);

    // Actions wrapper
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('todo-actions');

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = 'Edit';
    editBtn.dataset.action = 'edit';
    editBtn.dataset.id = todo.id;
    editBtn.setAttribute('aria-label', `Edit ${todo.title}`);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.dataset.id = todo.id;
    deleteBtn.setAttribute('aria-label', `Hapus ${todo.title}`);

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    list.appendChild(li);
  }
}

/**
 * Update class 'active' pada tombol filter.
 * Menandai tombol filter yang sedang aktif.
 * 
 * @param {'all' | 'active' | 'completed'} activeFilter - Filter yang sedang aktif
 * @returns {void}
 * 
 * @example
 * renderFilters('active')
 * // Tombol 'Belum Selesai' akan mendapat class 'active'
 */
export function renderFilters(activeFilter) {
  const container = document.getElementById('filter-buttons');
  const buttons = container.querySelectorAll('.filter-btn');
  for (const btn of buttons) {
    if (btn.dataset.filter === activeFilter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }
}

/**
 * Menampilkan atau menyembunyikan tombol "Hapus Selesai".
 * Tombol hanya ditampilkan jika ada minimal satu todo yang completed.
 * 
 * @param {Array<Todo>} todos - Array semua todo
 * @returns {void}
 * 
 * @example
 * renderClearButton([
 *   { id: '1', title: 'Task 1', completed: true, createdAt: 1234567890 }
 * ])
 * // Tombol "Hapus Selesai" akan ditampilkan
 */
export function renderClearButton(todos) {
  const btn = document.getElementById('clear-completed-btn');
  const hasCompleted = todos.some(t => t.completed);
  btn.hidden = !hasCompleted;
}

/**
 * Menampilkan pesan validasi pada elemen yang diberikan.
 * Pesan akan otomatis hilang setelah 3 detik atau ketika user mulai mengetik.
 * 
 * @param {HTMLElement} element - Elemen DOM untuk menampilkan pesan
 * @param {string} message - Pesan error yang akan ditampilkan
 * @returns {void}
 * 
 * @example
 * const msgEl = document.getElementById('validation-message')
 * showValidationMessage(msgEl, 'Judul tidak boleh kosong')
 * // Pesan akan muncul dan hilang otomatis setelah 3 detik
 */
export function showValidationMessage(element, message) {
  // Cancel timer sebelumnya jika ada
  if (element._validationTimer) {
    clearTimeout(element._validationTimer);
    element._validationTimer = null;
  }
  if (element._validationInputCleanup) {
    element._validationInputCleanup();
  }

  // Tampilkan pesan
  element.removeAttribute('hidden');
  element.textContent = message;

  const hide = () => {
    element.setAttribute('hidden', '');
    element.textContent = '';
    element._validationTimer = null;
    element._validationInputCleanup = null;
  };

  // Auto-hide setelah 3 detik
  element._validationTimer = setTimeout(hide, 3000);

  // Hide ketika user mulai mengetik (deferred agar submit event tidak trigger)
  const form = element.closest('form');
  const input = form ? form.querySelector('input') : null;
  if (input) {
    const onInput = () => {
      clearTimeout(element._validationTimer);
      hide();
      input.removeEventListener('input', onInput);
    };
    setTimeout(() => input.addEventListener('input', onInput), 0);
    element._validationInputCleanup = () => input.removeEventListener('input', onInput);
  }
}
