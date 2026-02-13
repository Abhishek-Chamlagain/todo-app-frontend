// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// State
let todos = [];
let currentFilter = 'all';
let editingTodoId = null;

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoTitleInput = document.getElementById('todo-title');
const todoDescriptionInput = document.getElementById('todo-description');
const todoList = document.getElementById('todo-list');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');
const emptyState = document.getElementById('empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');

// Stats
const totalCountEl = document.getElementById('total-count');
const pendingCountEl = document.getElementById('pending-count');
const completedCountEl = document.getElementById('completed-count');

// Modal
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editTitleInput = document.getElementById('edit-title');
const editDescriptionInput = document.getElementById('edit-description');
const closeModalBtn = document.getElementById('close-modal');
const cancelEditBtn = document.getElementById('cancel-edit');

// API Functions
async function fetchTodos() {
    try {
        showLoading();
        hideError();

        const response = await fetch(`${API_BASE_URL}/todos`);
        if (!response.ok) throw new Error('Failed to fetch todos');

        todos = await response.json();
        hideLoading();
        renderTodos();
        updateStats();
    } catch (error) {
        hideLoading();
        showError('Failed to load todos. Make sure the backend server is running on port 5000.');
        console.error('Error fetching todos:', error);
    }
}

async function createTodo(title, description) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, completed: false }),
        });

        if (!response.ok) throw new Error('Failed to create todo');

        const newTodo = await response.json();
        todos.unshift(newTodo);
        renderTodos();
        updateStats();
        hideError();
    } catch (error) {
        showError('Failed to create todo. Please try again.');
        console.error('Error creating todo:', error);
        throw error;
    }
}

async function updateTodo(id, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error('Failed to update todo');

        const updatedTodo = await response.json();
        todos = todos.map(todo => todo._id === id ? updatedTodo : todo);
        renderTodos();
        updateStats();
        hideError();
    } catch (error) {
        showError('Failed to update todo. Please try again.');
        console.error('Error updating todo:', error);
        throw error;
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete todo');

        todos = todos.filter(todo => todo._id !== id);
        renderTodos();
        updateStats();
        hideError();
    } catch (error) {
        showError('Failed to delete todo. Please try again.');
        console.error('Error deleting todo:', error);
    }
}

// UI Functions
function renderTodos() {
    const filteredTodos = getFilteredTodos();

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    todoList.innerHTML = filteredTodos.map(todo => `
    <li class="todo-item ${todo.completed ? 'completed' : ''}">
      <div class="todo-content">
        <div class="checkbox-wrapper">
          <input 
            type="checkbox" 
            class="custom-checkbox" 
            ${todo.completed ? 'checked' : ''}
            onchange="handleToggleComplete('${todo._id}', ${!todo.completed})"
          >
        </div>
        <div class="todo-text">
          <div class="todo-title">${escapeHtml(todo.title)}</div>
          ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ''}
        </div>
      </div>
      <div class="todo-meta">
        <div class="todo-date">
          Created ${formatDate(todo.createdAt)}
        </div>
        <div class="todo-actions">
          <button class="icon-btn edit" onclick="handleEdit('${todo._id}')">
            ✏️ Edit
          </button>
          <button class="icon-btn delete" onclick="handleDelete('${todo._id}')">
            🗑️ Delete
          </button>
        </div>
      </div>
    </li>
  `).join('');
}

function getFilteredTodos() {
    switch (currentFilter) {
        case 'pending':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    totalCountEl.textContent = total;
    pendingCountEl.textContent = pending;
    completedCountEl.textContent = completed;
}

function showLoading() {
    loadingElement.classList.remove('hidden');
}

function hideLoading() {
    loadingElement.classList.add('hidden');
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function hideError() {
    errorElement.classList.add('hidden');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openEditModal(todo) {
    editingTodoId = todo._id;
    editTitleInput.value = todo.title;
    editDescriptionInput.value = todo.description || '';
    editModal.classList.remove('hidden');
}

function closeEditModal() {
    editingTodoId = null;
    editForm.reset();
    editModal.classList.add('hidden');
}

// Event Handlers
async function handleToggleComplete(id, completed) {
    await updateTodo(id, { completed });
}

function handleEdit(id) {
    const todo = todos.find(t => t._id === id);
    if (todo) openEditModal(todo);
}

async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this todo?')) {
        await deleteTodo(id);
    }
}

// Event Listeners
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = todoTitleInput.value.trim();
    const description = todoDescriptionInput.value.trim();

    if (!title) return;

    try {
        await createTodo(title, description);
        todoForm.reset();
        todoTitleInput.focus();
    } catch (error) {
        // Error already handled in createTodo
    }
});

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = editTitleInput.value.trim();
    const description = editDescriptionInput.value.trim();

    if (!title || !editingTodoId) return;

    try {
        await updateTodo(editingTodoId, { title, description });
        closeEditModal();
    } catch (error) {
        // Error already handled in updateTodo
    }
});

closeModalBtn.addEventListener('click', closeEditModal);
cancelEditBtn.addEventListener('click', closeEditModal);

editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Initialize
fetchTodos();
