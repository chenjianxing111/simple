const STORAGE_KEY = 'vibe_todo_list';

let todos = load();

const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('taskList');
const emptyHint = document.getElementById('emptyHint');

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  if (todos.length === 0) {
    list.innerHTML = '';
    emptyHint.style.display = 'block';
    return;
  }

  emptyHint.style.display = 'none';
  list.innerHTML = todos.map(t => `
    <li data-id="${t.id}" class="${t.done ? 'done' : ''}">
      <span class="toggle">${t.done ? '✔' : ''}</span>
      <span class="task-text">${escapeHtml(t.text)}</span>
      <span class="del">删除</span>
    </li>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: Date.now(),
    text,
    done: false
  });

  input.value = '';
  save();
  render();
  input.focus();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    save();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

addBtn.addEventListener('click', addTodo);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

list.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.classList.contains('toggle') || e.target.classList.contains('task-text')) {
    toggleTodo(id);
  }

  if (e.target.classList.contains('del')) {
    deleteTodo(id);
  }
});

render();