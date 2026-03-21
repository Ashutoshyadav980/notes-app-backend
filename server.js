const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// In-memory storage (simple - no database!)
let notes = [
  {
    id: 1,
    title: 'Welcome',
    content: 'This is your first note!',
    createdAt: new Date(),
  },
];

let noteId = 2;

// GET all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// GET single note
app.get('/api/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(note);
});

// CREATE note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content required' });
  }

  const newNote = {
    id: noteId++,
    title,
    content,
    createdAt: new Date(),
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// UPDATE note
app.put('/api/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const { title, content } = req.body;
  if (title) note.title = title;
  if (content) note.content = content;

  res.json(note);
});

// DELETE note
app.delete('/api/notes/:id', (req, res) => {
  notes = notes.filter(n => n.id !== parseInt(req.params.id));
  res.json({ message: 'Note deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});