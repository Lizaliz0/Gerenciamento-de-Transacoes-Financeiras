const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1425',
    // password: '3862',
    database: 'dindin'
});

module.exports = pool;