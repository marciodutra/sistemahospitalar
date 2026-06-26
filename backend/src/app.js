const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes)
app.use("/appointments", appointmentRoutes);
app.use("/profile", profileRoutes);

// Rota teste
app.get("/", (req, res) => {
  res.json({
    message: "API Hospital rodando 🚑"
  });
});

module.exports = app;