const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
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

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
