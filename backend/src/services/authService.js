const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

async function login(email, password) {
  try {
    const result = await db.query(
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
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    };

  } catch (err) {
    // repassa erro corretamente pro controller
    throw err;
  }
}

module.exports = {
  login
};