import React, { useState, useEffect } from 'react'
import {Trash2, Plus, Save} from "lucide-react"

const NotesTaker = () => {
  const [notes, setNotes] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('notes')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to parse saved notes from localStorage', error)
      return []
    }
  })
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (title.trim() || content.trim()) {
      const newNote = {
        id: Date.now(),
        title: title || 'Untitled',
        content,
        date: new Date().toLocaleDateString()
      }
      setNotes([newNote, ...notes])
      setTitle('')
      setContent('')
      setSelectedId(newNote.id)
    }
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const updateNote = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, title: title || 'Untitled', content } : note
    ))
  }

  const selectNote = (note) => {
    setSelectedId(note.id)
    setTitle(note.title)
    setContent(note.content)
  }

  const filtered = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Notes Taker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No notes yet</p>
                ) : (
                  filtered.map(note => (
                    <div
                      key={note.id}
                      onClick={() => selectNote(note)}
                      className={`p-4 rounded-lg cursor-pointer transition backdrop-blur-lg border ${
                        selectedId === note.id
                          ? 'bg-blue-500/30 border-blue-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <h3 className="font-semibold text-white truncate">{note.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{note.content}</p>
                      <p className="text-gray-500 text-xs mt-2">{note.date}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-xl font-semibold focus:outline-none focus:border-blue-400 transition"
                />

                <textarea
                  placeholder="Start typing your note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-64 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition resize-none"
                />

                <div className="flex gap-3">
                  <button
                    onClick={selectedId ? () => updateNote(selectedId) : addNote}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition transform hover:scale-105"
                  >
                    <Save size={20} />
                    {selectedId ? 'Update' : 'Save'} Note
                  </button>

                  {selectedId && (
                    <button
                      onClick={() => {
                        deleteNote(selectedId)
                        setTitle('')
                        setContent('')
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition transform hover:scale-105"
                    >
                      <Trash2 size={20} />
                      Delete
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setTitle('')
                      setContent('')
                      setSelectedId(null)
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-lg font-semibold transition"
                  >
                    <Plus size={20} />
                    New
                  </button>
                </div>
              </div>
            </div>

            {notes.length > 0 && (
              <div className="mt-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
                <p className="text-gray-300 text-sm">
                  Total Notes: <span className="font-bold text-blue-400">{notes.length}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotesTaker
