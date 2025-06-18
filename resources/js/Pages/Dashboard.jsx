
import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';

const Dashboard = ({ notes: initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || []);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const { props: { errors, flash = {} } } = usePage();

  // Sync notes with server data
  useEffect(() => {
    setNotes(initialNotes || []);
  }, [initialNotes]);

  // Handle creating a new note
  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNote.title.trim()) return;

    const tempNote = {
      title: newNote.title,
      content: newNote.content,
    };

    // Optimistically update UI
    setNotes([tempNote, ...notes]);
    setNewNote({ title: '', content: '' });

    router.post('/notes', newNote, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setNotes(page.props.notes || []);
      },
      onError: (errors) => {
        console.error('Error creating note:', errors);
        setNotes(notes.filter((note) => note.id !== tempNote.id));
      },
    });
  };

  // Handle editing a note
  const handleEditNote = (note) => {
    setEditingNote({ ...note });
  };

  // Auto-save note changes
  const autoSaveNote = debounce((note) => {
    router.post(`/notes/${note.id}`, { ...note, _method: 'PUT' }, {
      preserveState: true,
      preserveScroll: true,
      onError: (errors) => {
        console.error('Error updating note:', errors);
      },
    });
  }, 1000);

  // Update editing note and trigger auto-save
  const handleNoteChange = (e, field) => {
    const updatedNote = { ...editingNote, [field]: e.target.value };
    setEditingNote(updatedNote);
    autoSaveNote(updatedNote);
  };

  // Handle deleting a note
  const handleDeleteNote = (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const originalNotes = [...notes];
      setNotes(notes.filter((note) => note.id !== id));
      router.delete(`/notes/${id}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          setNotes(page.props.notes || []);
        },
        onError: (errors) => {
          console.error('Error deleting note:', errors);
          setNotes(originalNotes); 
        },
      });
    }
  };

  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/logout', {}, {
      onSuccess: () => {
        // Redirect handled by Laravel
      },
      onError: (errors) => {
        console.error('Error logging out:', errors);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">Notes Dashboard</h1>
          <form onSubmit={handleLogout}>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Flash Messages */}
        {flash.success && (
          <div className="bg-green-100 p-4 mb-6 text-green-700 rounded-md">
            {flash.success}
          </div>
        )}
        {flash.error && (
          <div className="bg-red-100 p-4 mb-6 text-red-700 rounded-md">
            {flash.error}
          </div>
        )}

        {/* Create Note Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Note</h2>
          <form onSubmit={handleCreateNote}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Note Content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
              {errors.content && <span className="text-red-500 text-sm">{errors.content}</span>}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add Note
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-center">No notes yet. Create one above!</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-white p-6 rounded-lg shadow-md">
                {editingNote && editingNote.id === note.id ? (
                  <>
                    <input
                      type="text"
                      value={editingNote.title}
                      onChange={(e) => handleNoteChange(e, 'title')}
                      className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                    <textarea
                      value={editingNote.content || ''}
                      onChange={(e) => handleNoteChange(e, 'content')}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    ></textarea>
                    {errors.content && <span className="text-red-500 text-sm">{errors.content}</span>}
                    <button
                      onClick={() => setEditingNote(null)}
                      className="text-blue-500 text-sm mt-2 hover:underline"
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{note.title}</h3>
                    <p className="text-gray-600 mb-4">{note.content || 'No content'}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;