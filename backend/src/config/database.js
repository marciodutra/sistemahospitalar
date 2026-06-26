const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

async function connectDatabase() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Conectado ao PostgreSQL (Neon)");
  } catch (err) {
    console.error("❌ Erro ao conectar no PostgreSQL:", err.message);
    throw err;
  }
}

module.exports = { pool, connectDatabase };