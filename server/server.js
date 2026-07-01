const { Client } = require('pg');

const client = new Client ({
    user: 'postgres',
    host: 'localhost',
    database: 'aigirlfriend_db',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

async function testConnection() {
    try {
        await client.connect();
        console.log('Succesfully connected to local PostgreSQL instance!');

        const res = await client.query('SELECT NOW() as current_server_time;');
        console.log('Database server time verification:', res.rows[0].current_server_time);

    } catch (err) {
        console.error('Database connection error occured: ', err.stack);
    } finally {
        await client.end();
    }
}

testConnection();