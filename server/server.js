require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

const pool = require('./config/db.js')

app.get('/', async (req, res) => {
    try {
        const resDb = await pool.query('SELECT * FROM users');
        
        console.log('🚀 Smoke Test Success: Backend linked to PostgreSQL context!');
        console.table(resDb.rows);
        
        res.send("Hello world! Database test passed.");
    } catch (err) {
        console.error('❌ Smoke Test Failure: Backend cannot bridge to PostgreSQL server:', err.message);
        res.status(500).send("Database connection failed.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}"`);
});