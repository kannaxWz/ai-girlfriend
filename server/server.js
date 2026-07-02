require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

const pool = require('./config/db.js')

app.get('/', async (req, res) => {
    const resDb = await pool.query('SELECT NOW()');
    console.log('Database connected from Express! Time:', resDb.rows[0].now);
    res.send("Hello world");
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}"`);
});