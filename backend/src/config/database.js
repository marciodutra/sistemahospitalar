const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
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