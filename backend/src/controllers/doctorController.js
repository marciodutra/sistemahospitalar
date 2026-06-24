const db = require("../config/database");

// LISTAR
exports.getAllDoctors = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM doctors ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BUSCAR POR ID
exports.getDoctorById = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM doctors WHERE id = $1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CRIAR
exports.createDoctor = async (req, res) => {
  try {
    const { name, crm, specialty } = req.body;

    const result = await db.query(
      "INSERT INTO doctors (name, crm, specialty) VALUES ($1, $2, $3) RETURNING *",
      [name, crm, specialty]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ATUALIZAR
exports.updateDoctor = async (req, res) => {
  try {
    const { name, crm, specialty } = req.body;

    const result = await db.query(
      "UPDATE doctors SET name = $1, crm = $2, specialty = $3 WHERE id = $4 RETURNING *",
      [name, crm, specialty, req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETAR
exports.deleteDoctor = async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM doctors WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }

    res.json({ message: "Médico removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};