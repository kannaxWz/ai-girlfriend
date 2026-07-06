const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
    throw new Error("FATAL: DATABASE_URL environment variable is missing from the runtime context.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    
    max: 20,            
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000, 
});

pool.on('connect', () => {
    console.log('Database Connection Pool: Successfully leased a new client channel.');
});

pool.on('error', (err) => {
    console.error('Database Connection Pool Exception:', err.message);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool 
};