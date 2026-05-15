const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err);
    return;
  }
  console.log('MySQL Connected!');
});

app.get('/', (req, res) => {
  res.send('Job Board API is running!');
});

// Get all jobs
app.get('/api/jobs', (req, res) => {
  const query = `
    SELECT jobs.id, jobs.title, jobs.location, 
           jobs.salary, jobs.job_type,
           companies.name AS company
    FROM jobs
    INNER JOIN companies ON jobs.company_id = companies.id
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get single job by ID
app.get('/api/jobs/:id', (req, res) => {
  const query = `
    SELECT jobs.*, companies.name AS company, 
           companies.location AS company_location
    FROM jobs
    INNER JOIN companies ON jobs.company_id = companies.id
    WHERE jobs.id = ?
  `;
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
});

// Apply for a job
app.post('/api/applications', (req, res) => {
  const { user_id, job_id } = req.body;
  const query = `
    INSERT INTO applications (user_id, job_id, status) 
    VALUES (?, ?, 'applied')
  `;
  db.query(query, [user_id, job_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Application submitted successfully!' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});