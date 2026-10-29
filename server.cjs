const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'laban-data.json');

app.use(cors());
app.use(express.json());

// Les data fra fil
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { dogs: [], shows: [], goals: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { dogs: [], shows: [], goals: [] };
  }
}

// Skriv data til fil
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Hent all data
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// Lagre all data
app.post('/api/data', (req, res) => {
  try {
    writeData(req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Laban-server kjører på http://localhost:${PORT}`);
  console.log(`Data lagres i: ${DATA_FILE}`);
});
