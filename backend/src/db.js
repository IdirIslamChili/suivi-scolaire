const mysql = require('mysql2/promise');

/** Shared MySQL connection pool. Settings come from the .env file. */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'suivi_scolaire',
  charset: 'utf8mb4',
  dateStrings: true, // dates stay "YYYY-MM-DD" strings, like in the app
  decimalNumbers: true, // DECIMAL columns come back as numbers
});

/** Runs a parameterised query and returns the rows. */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { query };
