const path = require("path");
const dotenv = require("dotenv");

// carrega .env local
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;

// DEBUG opcional
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "OK (carregada)" : "UNDEFINED");

async function startServer() {
  try {
    // agora valida DATABASE_URL (não DB_PASSWORD)
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL não foi carregada");
    }

    await connectDatabase();

    app.listen(PORT, () => {
      console.log("=================================");
      console.log("🏥 Servidor Hospital iniciado");
      console.log(`🚪 Porta: ${PORT}`);
      console.log("=================================");
    });

  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error.message);
    process.exit(1);
  }
}

startServer();