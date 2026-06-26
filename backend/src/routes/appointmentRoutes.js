const express = require("express");
const router = express.Router();

const controller = require("../controllers/appointmentController");
const auth = require("../middlewares/authMiddleware");

// LISTAR (todos logados, mas filtrado no controller)
router.get("/", auth, controller.getAllAppointments);

// CRIAR (admin e doctor)
router.post("/", auth, controller.createAppointment);

// ATUALIZAR (admin e doctor)
router.put("/:id", auth, controller.updateAppointment);

// DELETAR (só admin será validado no controller)
router.delete("/:id", auth, controller.deleteAppointment);

module.exports = router;