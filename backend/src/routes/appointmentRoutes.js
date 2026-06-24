const express = require("express");
const router = express.Router();

const controller = require("../controllers/appointmentController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
console.log("auth:", typeof auth);
console.log("role:", typeof role);
console.log("controller:", controller);
console.log("create:", typeof controller.createAppointment);

// todos logados
router.get("/", auth, controller.getAllAppointments);

// admin cria consulta
router.post("/", auth, role("admin"), controller.createAppointment);

// admin altera status
router.put("/:id", auth, role("admin"), controller.updateAppointment);

// admin deleta
router.delete("/:id", auth, role("admin"), controller.deleteAppointment);

module.exports = router;