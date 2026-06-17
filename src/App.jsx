import { Link, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Calc from './components/Calc';
import TodoApp from './components/TodoApp';
import NotesTaker from './components/NotesTaker';
import Weather from './components/Weather';

function Home() {
  const paths = [
    { id: 'calc', name: 'Calculator', path: '/calc' },
    { id: 'todos', name: 'Todo App', path: '/todos' },
    { id: 'notes', name: 'Notes Taker', path: '/notes' },
    {id: 'weather', name: 'Weather Tracker', path: '/weather'},
  ];

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl'>
        <div className='mb-8 space-y-3 text-center'>
          <p className='text-sm uppercase tracking-[0.3em] text-slate-400'>Your mini projects</p>
          <h1 className='text-4xl font-semibold text-white'>Projects Launcher</h1>
          <p className='mx-auto max-w-2xl text-slate-400'>Choose an app to continue with a sleek glassmorphism interface.</p>
        </div>

        <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2'>
          {paths.map(({ id, name, path }, idx) => (
            <Link
              key={id}
              to={path}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              className='group rounded-3xl border border-white/15 bg-white/5 p-5 sm:p-6 transition duration-300 hover:bg-white/10 hover:shadow-[0_20px_80px_rgba(15,23,42,0.35)]'
            >
              <div className='space-y-3'>
                <h2 className='text-2xl font-semibold text-white'>{name}</h2>
                <p className='text-slate-400'>Open the {name.toLowerCase()} with a polished glass effect and soft glow.</p>
                <span className='inline-flex items-center rounded-full bg-slate-800/70 px-4 py-2 text-sm text-slate-300 transition group-hover:bg-slate-700/80'>Launch</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: 'ease-out-cubic' });
  }, []);
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/calc' element={<Calc />} />
      <Route path='/todos' element={<TodoApp />} />
      <Route path='/notes' element={<NotesTaker />} />
      <Route path='/weather' element={<Weather />} />
    </Routes>
  );
};

export default App;
