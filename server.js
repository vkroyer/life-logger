const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

// Open the database
let db = new sqlite3.Database('./data/lifelogger.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

// Serve static files from the Vue app build
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint to get all habits from the Habits database
app.get('/api/allHabits', (req, res) => {
  console.log('GET /api/allHabits');
  let sql = `SELECT * FROM Habits`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.post('/api/habit-tracking', (req, res) => {
  console.log('POST /api/habit-tracking');
  let sql = `INSERT INTO HabitTracking (HabitID, Date, IsDone) VALUES (?,?,?)`;
  db.run(sql, [req.body.HabitID, req.body.Date, req.body.IsDone], (err) => {
    if (err) {
      throw err;
    }
    res.json({ message: 'success', id: this.lastID });
  });
});

// Endpoint to get all hobbies from the Hobbies database
app.get('/api/allHobbies', (req, res) => {
  let sql = `SELECT * FROM Hobbies`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// The catch-all handler to serve the Vue app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Close the database connection when the server is stopped
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
    process.exit(0);
  });
});