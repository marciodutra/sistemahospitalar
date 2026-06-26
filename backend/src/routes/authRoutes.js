const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

// Login
router.post("/login", authController.login);

// Alterar senha (usuário logado)
router.put("/change-password", auth, authController.changePassword);

module.exports = router;