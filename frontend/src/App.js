import { useState, useEffect } from 'react';

if (!document.head.querySelector('link[data-app-font]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap';
  link.setAttribute('data-app-font', 'true');
  document.head.appendChild(link);
}


if (!document.head.querySelector('style[data-app-style]')) {
  const style = document.createElement('style');
  style.setAttribute('data-app-style', 'true');
  style.textContent = `::placeholder { color: rgba(1, 64, 170, 0.4) !important; }`;
  document.head.appendChild(style);
}

const API = 'http://localhost:5000/tasks';
const FONT = "'Oswald', 'Arial Black', sans-serif";
const HEADER_HEIGHT = 94; 
const STATUS = {
  new:         { label: 'НОВАЯ',      color: '#0122A0' },
  in_progress: { label: 'В ПРОЦЕССЕ', color: '#11BA1C' },
  done:        { label: 'ЗАВЕРШЕНА',  color: '#D30B0B' },
};

export default function App() {
  const [tasks, setTasks]             = useState([]);
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch]           = useState('');
  const [active, setActive]           = useState('create');
  const [formError, setFormError]     = useState('');

  const fetchTasks = () =>
    fetch(API).then(r => r.json()).then(d => setTasks(Array.isArray(d) ? d : []));

  useEffect(() => { fetchTasks(); }, []);

  const createTask = () => {
    if (!title.trim() || !description.trim()) {
      setFormError('Заполните название и описание задачи');
      return;
    }
    setFormError('');
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    }).then(() => { setTitle(''); setDescription(''); fetchTasks(); });
  };

  const updateStatus = (id, status) =>
    fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(fetchTasks);

  const deleteTask = (id) =>
    fetch(`${API}/${id}`, { method: 'DELETE' }).then(fetchTasks);

  const goTo = (id, tab) => {
    setActive(tab);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const visible = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      fontFamily: FONT, minHeight: '100vh', display: 'flex', flexDirection: 'column',background: `
        radial-gradient(circle at 12% 22%, rgba(255,255,255,0.5) 0%, transparent 38%),
        radial-gradient(circle at 88% 12%, rgba(181,230,255,0.45) 0%, transparent 40%),
        radial-gradient(circle at 78% 80%, rgba(70,196,238,0.35) 0%, transparent 42%),
        radial-gradient(circle at 8% 85%, rgba(158,229,255,0.4) 0%, transparent 40%),
        linear-gradient(135deg, #46C4EE 0%, #6FD3F5 45%, #9EE5FF 100%)
      `,
      position: 'relative',
    }}>
      
      <img
        src="/background.jpg"
        alt=""
        onError={e => { e.target.style.display = 'none'; }}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0, pointerEvents: 'none',
        }}
      />

      

      {/*Шапка*/}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: HEADER_HEIGHT, boxSizing: 'border-box',
        background: 'linear-gradient(90deg, #DDF7FB 0%, rgba(141,238,255,0.63) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 36px', flexShrink: 0,
        borderBottom: '1px solid rgba(3,37,94,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" alt="logo" style={{ height: 70 }} onError={e => e.target.style.display='none'} />
          <span style={{ fontSize: 40, fontWeight: 700, color: '#03255E', textShadow: '0 2px 40px rgb(0, 247, 255)', letterSpacing: 2 }}>esoft</span>
        </div>
        <button style={{
          background: '#03255E', color: '#fff', border: 'none',
          borderRadius: 36, padding: '8px 60px',
          fontFamily: FONT, fontWeight: 700, fontSize: 25, letterSpacing: 1, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(3,37,94,0.35)',
        }}>ГЛАВНАЯ</button>
      </header>

      {/*ТЕЛО*/}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative', zIndex: 1, paddingTop: HEADER_HEIGHT }}>

        {/*Боковая панель*/}
        <aside style={{
          position: 'fixed', top: HEADER_HEIGHT, left: 0, zIndex: 900,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          width: 250, flexShrink: 0, boxSizing: 'border-box',
          overflowX: 'visible',
          background: 'linear-gradient(180deg, rgba(124,178,228,0.85) 0%, rgba(141,238,255,0.5) 100%)',
          display: 'flex', flexDirection: 'column',
          padding: '28px 0 28px 28px',
          overflowY: 'auto',
        }}>
          <div style={{
            fontSize: 50, fontWeight: 700,
            letterSpacing: 1, marginBottom: 34, paddingRight: 12,
            lineHeight: 0.92,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #DDF7FB 50%, #8DEEFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 10px rgba(3,34,94,0.5))',
          }}>TASK MANAGER</div>

          <button onClick={() => goTo('create-section', 'create')} style={{
            display: 'flex', alignItems: 'center', gap: 2,
            background: active === 'create' ? 'rgba(255,255,255,0.9)' : 'rgba(255, 255, 255, 0)',
            color: active === 'create' ? '#03255E' : '#fff',
            border: 'none', cursor: 'pointer',
            fontFamily: FONT, fontWeight: 700, fontSize: 20, letterSpacing: 0.5,
            padding: '10px 18px 10px 8px', marginBottom: 10,
            borderRadius: '25px 0 0 25px',
            width: '100%', textAlign: 'left', whiteSpace: 'nowrap',
            boxShadow: active === 'create' ? '0 4px 50px rgba(3, 36, 94, 0.4)' : 'none',
          }}>
            <ClipboardIcon /> СОЗДАНИЕ ЗАДАЧИ
          </button>

          <button onClick={() => goTo('list-section', 'list')} style={{
            display: 'flex', alignItems: 'center', gap: 2,
            background: active === 'list' ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0)',
            color: active === 'list' ? '#03255E' : 'rgb(255, 255, 255)',
            border: 'none', cursor: 'pointer',
            fontFamily: FONT, fontWeight: 700, fontSize: 20, letterSpacing: 0.5,
            padding: '10px 24px 10px 8px',
            borderRadius: '25px 0 0 25px',
            width: '100%', textAlign: 'left', whiteSpace: 'nowrap',
            boxShadow: active === 'list' ? '0 4px 50px rgba(3, 36, 94, 0.4)' : 'none',
          }}>
            <ListIcon /> ПРОСМОТР ЗАДАЧ
          </button>
        </aside>

        {/*Контент-блок*/}
        <main style={{ flex: 1, marginLeft: 250, padding: '28px 80px 60px 36px' }}>

          {/*Создание задачи*/}
          <section id="create-section" style={{ scrollMarginTop: 1000, marginBottom: 32 }}>
            <div style={{
              background: 'linear-gradient(135deg, #B5E6FF 0%, #FFFFFF 100%)',
              borderRadius: 16, padding: '32px 40px 36px',
              boxShadow: '0 6px 24px rgba(3,37,94,0.12)',
            }}>
              <h1 style={{ color: '#0140AA', fontSize: 52,background: 'linear-gradient(135deg, #03255E 0%, #0140AA 50%, #306CD0 100%)',WebkitBackgroundClip: 'text',WebkitTextFillColor: 'transparent',backgroundClip: 'text',filter: 'drop-shadow(0 3px 20px rgba(144, 181, 245, 0.83))', fontWeight: 700, margin: '0 0 22px', letterSpacing: 1 }}>
                НОВАЯ ЗАДАЧА
              </h1>

              <label style={labelStyle}>НАЗВАНИЕ</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Введите название" style={inputStyle} />

              <label style={{ ...labelStyle, marginTop: 16 }}>ОПИСАНИЕ</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Введите описание" rows={4}
                style={{ ...inputStyle, resize: 'vertical' }} />

              {/*Кнопка создание*/}
              <CreateButton onClick={createTask} />
              {formError && (
                <div style={{ color: '#D30B0B', fontWeight: 600, fontSize: 22, marginTop: 10 }}>
                  {formError}
                </div>
              )}
            </div>
          </section>

          {/*Поиск*/}
          <div id="list-section" style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24, scrollMarginTop: 20, background: 'rgba(255, 255, 255, 0.79)', borderRadius: 32, overflow: 'hidden' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию"
              style={{
                flex: 1, background: 'transparent', border: 'none',
                padding: '14px 24px',
                fontFamily: FONT, fontWeight: 600, fontSize: 20, color: '#03255E', outline: 'none',
              }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              borderRadius: '0 30px 30px 0',
              background: 'rgba(113, 177, 250, 0.79)', padding: '14px 104px',
              color: '#0140AA', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap',
            }}>
              <SearchIcon /> ПОИСК
            </div>
          </div>

          {/*Список задач*/}
          {visible.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px',
              color: '#03255E', fontWeight: 600, fontSize: 18,
              background: 'rgba(255,255,255,0.35)', borderRadius: 14,
            }}>
              {tasks.length === 0 ? 'Задач пока нет — создайте первую выше 👆' : 'Ничего не найдено'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(485px, 240px))', gap: 16, alignItems: 'start' }}>
              {visible.map((task, i) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  number={i + 1}
                  onDelete={() => deleteTask(task.id)}
                  onStatusChange={s => updateStatus(task.id, s)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/*Кнопка создание*/
function CreateButton({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        marginTop: 24,
        display: 'flex', alignItems: 'center', gap: 12,
        background: hover
          ? 'linear-gradient(90deg, #0140AA 0%, #17ABE2 100%)'
          : 'linear-gradient(90deg, #03255E 0%, #0140AA 60%, #306CD0 100%)',
        color: '#fff', border: 'none',
        borderRadius: 12,
        padding: '15px 36px',
        fontFamily: FONT, fontWeight: 700, fontSize: 18, letterSpacing: 1,
        cursor: 'pointer',
        boxShadow: hover
          ? '0 10px 32px rgba(1,64,170,0.55)'
          : '0 4px 16px rgba(3,37,94,0.35)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
      }}
    >
      <span>СОЗДАТЬ ЗАДАЧУ</span>
    </button>
  );
}

const CARD_HEIGHT = 230;
const DESC_LIMIT = 60;

function TaskCard({ task, number, onDelete, onStatusChange }) {
  const [open, setOpen] = useState(false);      
  const [expanded, setExpanded] = useState(false); 
  const st = STATUS[task.status] || STATUS.new;

  const desc = task.description || '';
  const isLong = desc.length > DESC_LIMIT;
  const shownDesc = expanded || !isLong ? desc : desc.slice(0, DESC_LIMIT) + '…';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.55)', borderRadius: 14,
      padding: '16px 18px 18px', position: 'relative',
      boxShadow: '0 4px 14px rgba(3,37,94,0.1)',
      display: 'flex', flexDirection: 'column',
      minHeight: expanded ? 'auto' : CARD_HEIGHT,
      maxWidth: '100%', width: '100%',
      overflow: 'visible',
      boxSizing: 'border-box',
      transition: 'min-height 0.2s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{ color: '#3674e0', fontWeight: 700, fontSize: 20 }}>
          ЗАДАЧА {number}
        </span>
        <button onClick={onDelete} style={{
          display: 'flex', alignItems: 'center', gap: 3,
          background: 'none', border: 'none', color: '#D30B0B',
          fontFamily: FONT, fontWeight: 700, fontSize: 16, cursor: 'pointer', flexShrink: 0,
        }}>
          <TrashIcon /> УДАЛИТЬ
        </button>
      </div>

      <div style={{
        color: '#0140AA', fontWeight: 700, fontSize: 23, marginBottom: 15,
        wordBreak: 'break-word', overflowWrap: 'anywhere',
      }}>
        {task.title.toUpperCase()}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 1, flexWrap: 'wrap', minWidth: 0, minHeight: 20 }}>
        {desc && (
          <div style={{
            color: '#306CD0', fontWeight: 600, fontSize: 16, lineHeight: 1.4,
            wordBreak: 'break-word', overflowWrap: 'anywhere', minWidth: 0, maxWidth: '100%',
          }}>
            {shownDesc.toUpperCase()}
          </div>
        )}
        
        <button
          onClick={() => isLong && setExpanded(!expanded)}
          title={expanded ? 'Свернуть' : 'Показать полностью'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 20, flexShrink: 0,
            background: isLong ? '#0140AA' : 'transparent',
            border: 'none', borderRadius: 8,
            color: '#fff', fontWeight: 700, fontSize: 13,
            cursor: isLong ? 'pointer' : 'default',
            letterSpacing: 1, visibility: isLong ? 'visible' : 'hidden',
          }}
        >
          {expanded ? '▲' : '•••'}
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ position: 'relative', marginTop: 10 }}>
        <div onClick={() => setOpen(!open)} style={{
          color: st.color, fontWeight: 700, fontSize: 24,
          textAlign: 'center', cursor: 'pointer', padding: '6px 0',
          letterSpacing: 0.3,
        }}>
          {st.label}
        </div>

        {open && (
          <div style={{
            position: 'absolute', top: '100%',
            left: '50%', transform: 'translateX(-50%)',
            width: 160, background: '#fff', borderRadius: 10, zIndex: 50,
            boxShadow: '0 8px 24px rgba(3,37,94,0.2)', overflow: 'hidden',
            marginTop: 4,
          }}>
            {Object.entries(STATUS).map(([key, val]) => (
              <div key={key} onClick={() => { onStatusChange(key); setOpen(false); }} style={{
                padding: '10px 16px', color: val.color, fontWeight: 700,
                fontSize: 20, cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0', textAlign: 'center',
              }}>{val.label}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', color: '#0140AA', fontWeight: 600,
  fontSize: 30, letterSpacing: 0.5, marginBottom: 8,
};

const inputStyle = {
  display: 'block', width: '100%', boxSizing: 'border-box',
  background: 'rgba(180,220,255,0.45)', border: 'none', borderRadius: 10,
  padding: '13px 18px', fontFamily: FONT, fontWeight: 600,
  fontSize: 20, color: '#03255E', outline: 'none',
};

function ClipboardIcon() {
  return <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 12l2 2 4-4"/></svg>;
}
function ListIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}><path d="M4 6l2 2 4-4M4 14l2 2 4-4M12 7h8M12 16h8"/></svg>;
}
function SearchIcon() {
  return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>;
}
function TrashIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"/></svg>;
}