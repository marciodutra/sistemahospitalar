const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");

async function login(email, password) {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Senha inválida");
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role,
        doctor_id: user.doctor_id,
        patient_id: user.patient_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        doctor_id: user.doctor_id,
        patient_id: user.patient_id,
      },
    };

  } catch (err) {
    throw err;
  }
}

async function changePassword(userId, currentPassword, newPassword) {

  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [userId]
  );

  if (!result.rows.length) {
    throw new Error("Usuário não encontrado");
  }

  const user = result.rows[0];

  const passwordMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Senha atual incorreta");
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    "UPDATE users SET password = $1 WHERE id = $2",
    [hash, userId]
  );

  return true;
}

module.exports = {
  login,
  changePassword,
};