const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Enable CORS and JSON body parsing.
app.use(cors());
app.use(express.json());

// Path to the JSON database file. It will be created in the same directory as this server file.
const DB_FILE = path.join(__dirname, 'answers.json');

// Persist a new answer. Accepts name, answer, and time in the request body.
app.post('/answer', (req, res) => {
  const { name, answer, time } = req.body;
  let data = [];
  if (fs.existsSync(DB_FILE)) {
    data = JSON.parse(fs.readFileSync(DB_FILE));
  }
  data.push({ name, answer, time });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// Admin route to retrieve all answers. Requires a query parameter `password`.
app.get('/admin', (req, res) => {
  const password = req.query.password;
  // Hard-coded password for simplicity. In a real app, use environment variables or a secure store.
  if (password !== 'Talha123') {
    return res.status(401).json({ error: 'Wrong Password' });
  }
  if (!fs.existsSync(DB_FILE)) {
    return res.json([]);
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(data);
});

// Serve static files from the public directory. This hosts our React app built with Babel in the browser.
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// For any route not handled by API routes above, send back the index.html. This enables SPA routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start the server. Glitch assigns PORT via environment variable; default to 3000 for local development.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
