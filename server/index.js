const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Enable CORS for the Vercel frontend URL
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://data-baseconnect-checker.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

app.post('/api/check-db', async (req, res) => {
  const { type, host, port, user, password, database } = req.body;
  if (!type || !host || !port || !user || !password || !database) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  try {
    if (type === 'mysql') {
      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host,
        port,
        user,
        password,
        database,
        connectTimeout: 5000
      });
      await conn.end();
      return res.json({ success: true });
    } else if (type === 'postgres') {
      const { Client } = require('pg');
      const client = new Client({
        host,
        port,
        user,
        password,
        database,
        connectionTimeoutMillis: 5000
      });
      await client.connect();
      await client.end();
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: 'Unsupported DB type' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
