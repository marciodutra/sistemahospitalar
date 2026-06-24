const db = require("../config/database");

// LISTAR
exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM patients ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BUSCAR POR ID
exports.getPatientById = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM patients WHERE id = $1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CRIAR
exports.createPatient = async (req, res) => {
  try {
    const { name, cpf } = req.body;

    const result = await db.query(
      "INSERT INTO patients (name, cpf) VALUES ($1, $2) RETURNING *",
      [name, cpf]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ATUALIZAR
exports.updatePatient = async (req, res) => {
  try {
    const { name, cpf } = req.body;

    const result = await db.query(
      "UPDATE patients SET name = $1, cpf = $2 WHERE id = $3 RETURNING *",
      [name, cpf, req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETAR
exports.deletePatient = async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    res.json({ message: "Paciente removido com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};