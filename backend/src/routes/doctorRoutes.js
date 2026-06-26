const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// TODAS ROTAS PRECISAM LOGIN
router.use(auth);

// LISTAR
router.get("/", doctorController.getAllDoctors);

// BUSCAR POR ID
router.get("/:id", doctorController.getDoctorById);

// CRIAR → só ADMIN
router.post("/", role("ADMIN"), doctorController.createDoctor);

// ATUALIZAR → ADMIN ou próprio médico (controller já valida isso)
router.put("/:id", doctorController.updateDoctor);

// DELETAR → só ADMIN
router.delete("/:id", role("ADMIN"), doctorController.deleteDoctor);

module.exports = router;