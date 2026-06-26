const { pool } = require("../config/database");

exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = $1",
    [userId]
  );

  res.json(result.rows[0]);
};