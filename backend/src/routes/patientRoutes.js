const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");

// Listar todos os pacientes
router.get("/", patientController.getAllPatients);

// Buscar paciente por ID
router.get("/:id", patientController.getPatientById);

// Criar paciente
router.post("/", patientController.createPatient);

// Atualizar paciente
router.put("/:id", patientController.updatePatient);

// Deletar paciente
router.delete("/:id", patientController.deletePatient);

module.exports = router;