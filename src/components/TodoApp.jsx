import React, { useEffect, useMemo, useState } from 'react'

const TodoApp = () => {
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const saved = window.localStorage.getItem('mini-calc-todos')
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  useEffect(() => {
    window.localStorage.setItem('mini-calc-todos', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        text: trimmed,
        completed: false,
      },
    ])
    setText('')
  }

  const toggleTask = id => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const removeTask = id => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed))
  }

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter(task => !task.completed)
    if (filter === 'completed') return tasks.filter(task => task.completed)
    return tasks
  }, [tasks, filter])

  const remaining = tasks.filter(task => !task.completed).length

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),transparent_20%)]" />
      <div className="relative w-full max-w-3xl space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-slate-950/40 overflow-hidden">
          <div className="p-8 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-900/95">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Glass Todo</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-50">
                  Your modern todo
                </h1>
              </div>
              <div className="rounded-3xl bg-slate-900/70 px-5 py-4 ring-1 ring-white/10 shadow-lg shadow-slate-950/20">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Remaining</p>
                <p className="mt-2 text-3xl font-semibold text-sky-200">{remaining}</p>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-slate-400 leading-7">
              Manage your tasks with a sleek glass-style interface, quick filters, and effortless reminders for everything you need to get done.
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="flex-1 rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-inner shadow-black/20 focus-within:ring-2 focus-within:ring-sky-400/40">
                <span className="sr-only">Add new todo</span>
                <input
                  className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 outline-none"
                  type="text"
                  value={text}
                  placeholder="Create a new todo"
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addTask()
                  }}
                />
              </label>
              <button
                className="rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                onClick={addTask}
              >
                Add task
              </button>
            </div>

            <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-lg shadow-slate-950/30">
              <div className="flex flex-wrap gap-3 sm:justify-between sm:gap-4">
                <div className="flex gap-2">
                  {['all', 'active', 'completed'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFilter(option)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        filter === option
                          ? 'bg-sky-500 text-slate-950'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {option === 'all' ? 'All' : option === 'active' ? 'Active' : 'Completed'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={clearCompleted}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  Clear completed
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-5 py-8 text-center text-slate-500">
                    {tasks.length === 0 ? 'Start by adding a new task.' : 'No tasks match the selected filter.'}
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-4 shadow-inner shadow-black/20"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition ${
                          task.completed
                            ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                            : 'border-white/10 bg-white/5 text-slate-200 hover:border-sky-400'
                        }`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed ? '✓' : ''}
                      </button>
                      <p className={`flex-1 text-left text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                        {task.text}
                      </p>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="rounded-2xl px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-300/10 hover:text-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default TodoApp
