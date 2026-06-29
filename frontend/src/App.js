import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchTasks = () => {
    fetch(API)
      .then(r => r.json())
      .then(setTasks);
  };

  useEffect(() => { fetchTasks(); }, []);

  const createTask = () => {
    if (!title.trim()) return;
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    }).then(() => { setTitle(''); setDescription(''); fetchTasks(); });
  };

  const updateStatus = (id, status) => {
    fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(fetchTasks);
  };

  const deleteTask = (id) => {
    fetch(`${API}/${id}`, { method: 'DELETE' }).then(fetchTasks);
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>AI Task Manager</h1>

      <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, marginBottom: 24 }}>
        <h2>Новая задача</h2>
        <input
          placeholder="Название"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8, boxSizing: 'border-box' }}
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8, boxSizing: 'border-box' }}
        />
        <button onClick={createTask} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Создать задачу
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e0e0e0' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>Название</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Описание</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Статус</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: 10 }}>{task.title}</td>
              <td style={{ padding: 10 }}>{task.description}</td>
              <td style={{ padding: 10 }}>
                <select
                  value={task.status}
                  onChange={e => updateStatus(task.id, e.target.value)}
                >
                  <option value="new">Новая</option>
                  <option value="in_progress">В процессе</option>
                  <option value="done">Выполнена</option>
                </select>
              </td>
              <td style={{ padding: 10 }}>
                <button onClick={() => deleteTask(task.id)} style={{ cursor: 'pointer', color: 'red' }}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
