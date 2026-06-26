const { pool } = require("../config/database");
const bcrypt = require("bcrypt");

// LISTAR MÉDICOS (com permissão)
exports.getAllDoctors = async (req, res) => {
  try {
    const { role, doctor_id } = req.user;

    // ADMIN → todos
    if (role === "admin") {
      const result = await pool.query(
        "SELECT * FROM doctors ORDER BY id DESC"
      );
      return res.json(result.rows);
    }

    // DOCTOR → só ele mesmo
    if (role === "DOCTOR") {
      const result = await pool.query(
        "SELECT * FROM doctors WHERE id = $1",
        [doctor_id]
      );
      return res.json(result.rows);
    }

    // PATIENT → pode ver todos médicos (para agendar consulta)
    if (role === "PATIENT") {
      const result = await pool.query(
        "SELECT id, name, specialty FROM doctors ORDER BY name ASC"
      );
      return res.json(result.rows);
    }

    return res.status(403).json({ error: "Acesso negado" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// BUSCAR POR ID (com permissão)
exports.getDoctorById = async (req, res) => {
  try {
    const { role, doctor_id } = req.user;

    const result = await pool.query(
      "SELECT * FROM doctors WHERE id = $1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }

    const doctor = result.rows[0];

    // regras de acesso
    if (role === "ADMIN") {
      return res.json(doctor);
    }

    if (role === "DOCTOR" && doctor.id === doctor_id) {
      return res.json(doctor);
    }

    return res.status(403).json({ error: "Acesso negado" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE (somente ADMIN)
exports.createDoctor = async (req, res) => {
  const client = await pool.connect();

  try {
    const { role } = req.user;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Apenas admin pode criar médicos" });
    }

    await client.query("BEGIN");

    const { name, crm, specialty, email } = req.body;

    const doctor = await client.query(
      `
      INSERT INTO doctors (name, crm, specialty, email)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, crm, specialty, email]
    );

    const doctorId = doctor.rows[0].id;

    const passwordHash = await bcrypt.hash(crm, 10);

    await client.query(
      `
      INSERT INTO users (name, email, password, role, doctor_id)
      VALUES ($1, $2, $3, 'DOCTOR', $4)
      `,
      [name, email, passwordHash, doctorId]
    );

    await client.query("COMMIT");

    res.status(201).json(doctor.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// UPDATE (ADMIN ou próprio médico)
exports.updateDoctor = async (req, res) => {
  try {
    const { role, doctor_id } = req.user;

    const { name, crm, specialty, email } = req.body;

    const doctor = await pool.query(
      "SELECT * FROM doctors WHERE id = $1",
      [req.params.id]
    );

    if (!doctor.rows.length) {
      return res.status(404).json({ error: "Médico não encontrado" });
    }

    const isOwner = role === "DOCTOR" && doctor_id == req.params.id;

    if (role !== "ADMIN" && !isOwner) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const result = await pool.query(
      `
      UPDATE doctors
      SET name = $1,
          crm = $2,
          specialty = $3,
          email = $4
      WHERE id = $5
      RETURNING *
      `,
      [name, crm, specialty, email, req.params.id]
    );

    await pool.query(
      `
      UPDATE users
      SET name = $1,
          email = $2
      WHERE doctor_id = $3
      `,
      [name, email, req.params.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (somente ADMIN)
exports.deleteDoctor = async (req, res) => {
  const client = await pool.connect();

  try {
    const { role } = req.user;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Apenas admin pode excluir médicos" });
    }

    await client.query("BEGIN");

    await client.query(
      "DELETE FROM users WHERE doctor_id = $1",
      [req.params.id]
    );

    const result = await client.query(
      "DELETE FROM doctors WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Médico não encontrado" });
    }

    await client.query("COMMIT");

    res.json({ message: "Médico removido com sucesso" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};