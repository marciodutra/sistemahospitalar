const authService = require("../services/authService");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.json(result);

  } catch (err) {
    return res.status(401).json({
      error: err.message
    });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    return res.json({
      message: "Senha alterada com sucesso"
    });

  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
}

module.exports = {
  login,
  changePassword,
};