const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// todas rotas precisam login
router.use(auth);

// LISTAR
router.get("/", patientController.getAllPatients);

// BUSCAR
router.get("/:id", patientController.getPatientById);

// CRIAR → só ADMIN
router.post("/", role("ADMIN"), patientController.createPatient);

// UPDATE → ADMIN ou paciente (controle já está no controller)
router.put("/:id", patientController.updatePatient);

// DELETE → só ADMIN
router.delete("/:id", role("ADMIN"), patientController.deletePatient);

module.exports = router;