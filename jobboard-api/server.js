const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const JWT_SECRET = 'workbridge_secret_key';

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const connectDB = () => {
  db.connect((err) => {
    if (err) {
      console.log('Database connection failed, retrying in 5s...', err);
      setTimeout(connectDB, 5000);
      return;
    }
    console.log('MySQL Connected!');
  });

  db.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('DB connection lost, reconnecting...');
      connectDB();
    } else {
      throw err;
    }
  });
}

connectDB();

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

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [name, email, hashedPassword, role], (err, results) => {
    if (err) {
      console.log('REGISTER ERROR:', err);
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Account created successfully!' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE name = ?`;
  db.query(query, [username], async (err, results) => {
    if (err || results.length === 0) {
      res.status(400).json({ error_msg: 'Invalid username or password' });
      return;
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error_msg: 'Invalid username or password' });
      return;
    }
    const jwt_token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ jwt_token });
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});