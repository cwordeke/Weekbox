/* All dates use local time; date-only keys must never be parsed as UTC. */
const STORAGE_KEY = 'weekbox.tasks.v1';
const weekElement = document.querySelector('#week');
const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
function monday(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  result.setDate(result.getDate() - (result.getDay() + 6) % 7);
  return result;
}
function offset(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
let selectedWeek = monday(new Date());
let tasks = {};
let storageReadable = true;
function storageWarning(message) {
  const notice = document.querySelector('#storage-message');
  notice.textContent = message;
  notice.hidden = false;
}
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (!stored || typeof stored !== 'object' || Array.isArray(stored) || !Object.entries(stored).every(([key, list]) => /^\d{4}-\d{2}-\d{2}$/.test(key) && Array.isArray(list) && list.every(task => task && typeof task.id === 'string' && typeof task.text === 'string' && typeof task.done === 'boolean'))) throw new Error('Invalid saved data');
  tasks = stored;
} catch {
  storageReadable = false;
  storageWarning('Saved tasks could not be loaded. Changes will stay in this tab only, so your existing saved data is not overwritten.');
}
function save() {
  if (!storageReadable) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    document.querySelector('#storage-message').hidden = true;
  } catch {
    storageWarning('Your browser could not save these changes. Keep this tab open to avoid losing them.');
  }
}
function button(text, className, label, action) {
  const element = document.createElement('button');
  element.type = 'button';
  element.textContent = text;
  element.className = className;
  if (label) element.setAttribute('aria-label', label);
  element.addEventListener('click', action);
  return element;
}
function edit(key, task, target) {
  // Commit any other open editor before starting a new one.
  document.querySelector('.editor')?.blur();
  const input = document.createElement('input');
  input.className = 'editor';
  input.maxLength = 300;
  input.value = task?.text || '';
  input.placeholder = 'What needs doing?';
  input.setAttribute('aria-label', task ? 'Edit task' : `New task for ${key}`);
  target.replaceWith(input);
  let finished = false;
  function finish(cancel = false) {
    if (finished) return;
    finished = true;
    const text = input.value.trim();
    if (!cancel && text) {
      if (task) task.text = text;
      else (tasks[key] ||= []).push({ id: crypto.randomUUID(), text, done: false });
      save();
    }
    input.replaceWith(target);
    if (task) {
      target.textContent = task.text;
      target.setAttribute('aria-label', `Edit ${task.text}`);
      const row = target.closest('.task');
      row.querySelector('input').setAttribute('aria-label', `Mark ${task.text} complete`);
      row.querySelector('.delete').setAttribute('aria-label', `Delete ${task.text}`);
    }
    // Only replace this card's task list: other buttons must survive blur so
    // the click that ended the edit can still reach its intended target.
    const liveCard = document.getElementById(`day-${key}`);
    const oldList = liveCard.querySelector('.tasks');
    if (!task && !cancel && text) {
      const temporary = document.createElement('ul');
      renderTasks(temporary, key);
      oldList.append(temporary.lastElementChild);
    }
    const card = document.getElementById(`day-${key}`);
    const restored = task ? Array.from(card.querySelectorAll('.task-text')).find(el => el.dataset.id === task.id) : card.querySelector('.add');
    if (document.activeElement === document.body) restored?.focus({ preventScroll: true });
  }
  input.addEventListener('blur', () => finish());
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      finish(event.key === 'Escape');
    }
  });
  input.focus();
  input.select();
}
function render() {
  const end = offset(selectedWeek, 6);
  const format = date => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(selectedWeek.getFullYear() !== end.getFullYear() ? { year: 'numeric' } : {}) });
  document.querySelector('#week-title').textContent = `${format(selectedWeek)} – ${format(end)}${selectedWeek.getFullYear() === end.getFullYear() ? `, ${end.getFullYear()}` : ''}`;
  weekElement.replaceChildren();
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const date = offset(selectedWeek, dayIndex);
    const key = dateKey(date);
    const current = key === dateKey(new Date());
    const card = document.createElement('article');
    card.id = `day-${key}`;
    card.className = `day${current ? ' current' : ''}`;
    const heading = document.createElement('div');
    heading.className = 'day-heading';
    const name = document.createElement('h3');
    name.id = `heading-${key}`;
    name.textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
    card.setAttribute('aria-labelledby', name.id);
    const number = document.createElement('time');
    number.className = 'date';
    number.dateTime = key;
    number.textContent = date.getDate();
    number.setAttribute('aria-label', date.toLocaleDateString('en-US', { dateStyle: 'full' }));
    if (current) number.setAttribute('aria-current', 'date');
    heading.append(name, number);
    const list = document.createElement('ul');
    list.className = 'tasks';
    renderTasks(list, key);
    const add = button('+ Add task', 'add', `Add task for ${name.textContent}`, () => edit(key, null, add));
    card.append(heading, list, add);
    weekElement.append(card);
  }
}
function renderTasks(list, key) {
    list.replaceChildren();
    for (const task of tasks[key] || []) {
      const row = document.createElement('li');
      row.className = `task${task.done ? ' completed' : ''}`;
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.setAttribute('aria-label', `Mark ${task.text} complete`);
      checkbox.addEventListener('change', () => {
        task.done = checkbox.checked;
        row.classList.toggle('completed', task.done);
        save();
      });
      const text = button(task.text, 'task-text', `Edit ${task.text}`, () => edit(key, task, text));
      text.dataset.id = task.id;
      const remove = button('×', 'delete', `Delete ${task.text}`, () => {
        tasks[key] = tasks[key].filter(item => item.id !== task.id);
        if (!tasks[key].length) delete tasks[key];
        save();
        render();
        document.getElementById(`day-${key}`).querySelector('.add').focus({ preventScroll: true });
      });
      row.append(checkbox, text, remove);
      list.append(row);
    }
}
document.querySelector('#previous').addEventListener('click', () => { selectedWeek = offset(selectedWeek, -7); render(); });
document.querySelector('#next').addEventListener('click', () => { selectedWeek = offset(selectedWeek, 7); render(); });
document.querySelector('#today').addEventListener('click', () => { selectedWeek = monday(new Date()); render(); });
render();
