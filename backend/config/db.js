const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  }
};

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  connectDB
};
