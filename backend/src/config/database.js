const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD || ""),
  database: process.env.DB_NAME,
});

async function connectDatabase() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL conectado com sucesso.");
  } catch (err) {
    console.error("❌ Erro ao conectar no PostgreSQL:", err.message);
    process.exit(1);
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  connectDatabase
};