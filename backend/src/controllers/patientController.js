const bcrypt = require("bcrypt");
const { pool } = require("../config/database");

// LISTAR (com permissão)
exports.getAllPatients = async (req, res) => {
  try {
    const { role } = req.user;

    let result;

    // ADMIN → todos
    if (role === "admin") {
      result = await pool.query(
        "SELECT * FROM patients ORDER BY id DESC"
      );
    }

    // PATIENT → só ele mesmo (corrigido)
    else if (role === "PATIENT") {
      const user = await pool.query(
        "SELECT patient_id FROM users WHERE id = $1",
        [req.user.id]
      );

      const patientId = user.rows[0]?.patient_id;

      if (!patientId) {
        return res.json([]);
      }

      result = await pool.query(
        "SELECT * FROM patients WHERE id = $1",
        [patientId]
      );
    }

    // DOCTOR → pacientes das consultas dele
    else if (role === "DOCTOR") {
      const user = await pool.query(
        "SELECT doctor_id FROM users WHERE id = $1",
        [req.user.id]
      );

      const doctorId = user.rows[0]?.doctor_id;

      if (!doctorId) {
        return res.json([]);
      }

      result = await pool.query(
        `
        SELECT DISTINCT p.*
        FROM patients p
        INNER JOIN appointments a ON a.patient_id = p.id
        WHERE a.doctor_id = $1
        ORDER BY p.id DESC
        `,
        [doctorId]
      );
    }

    else {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BUSCAR POR ID (corrigido)
exports.getPatientById = async (req, res) => {
  try {
    const { role } = req.user;

    const result = await pool.query(
      "SELECT * FROM patients WHERE id = $1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    const patient = result.rows[0];

    // ADMIN pode tudo
    if (role === "ADMIN") {
      return res.json(patient);
    }

    // PATIENT (corrigido)
    if (role === "PATIENT") {
      const user = await pool.query(
        "SELECT patient_id FROM users WHERE id = $1",
        [req.user.id]
      );

      if (user.rows[0]?.patient_id == patient.id) {
        return res.json(patient);
      }
    }

    // DOCTOR (corrigido)
    if (role === "DOCTOR") {
      const user = await pool.query(
        "SELECT doctor_id FROM users WHERE id = $1",
        [req.user.id]
      );

      const doctorId = user.rows[0]?.doctor_id;

      const check = await pool.query(
        `
        SELECT 1
        FROM appointments
        WHERE doctor_id = $1 AND patient_id = $2
        LIMIT 1
        `,
        [doctorId, patient.id]
      );

      if (check.rows.length) {
        return res.json(patient);
      }
    }

    return res.status(403).json({ error: "Acesso negado" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE (somente ADMIN)
exports.createPatient = async (req, res) => {
  const client = await pool.connect();

  try {
    const { role } = req.user;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Apenas admin pode criar pacientes" });
    }

    await client.query("BEGIN");

    const { name, cpf, email } = req.body;

    const patient = await client.query(
      `
      INSERT INTO patients(name, cpf, email)
      VALUES($1,$2,$3)
      RETURNING *
      `,
      [name, cpf, email]
    );

    const patientId = patient.rows[0].id;

    const hash = await bcrypt.hash(cpf.replace(/\D/g, ""), 10);

    await client.query(
      `
      INSERT INTO users(name,email,password,role,patient_id)
      VALUES($1,$2,$3,'PATIENT',$4)
      `,
      [name, email, hash, patientId]
    );

    await client.query("COMMIT");

    res.status(201).json(patient.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// UPDATE (corrigido)
exports.updatePatient = async (req, res) => {
  try {    
    
    const { role } = req.user;

    const { name, cpf, email } = req.body;

    const patient = await pool.query(
      "SELECT * FROM patients WHERE id = $1",
      [req.params.id]
    );

    if (!patient.rows.length) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    // pega vínculo real do usuário
    const user = await pool.query(
      "SELECT patient_id FROM users WHERE id = $1",
      [req.user.id]
    );

    const userPatientId = user.rows[0]?.patient_id;

    const isAdmin = role === "admin" || role === "ADMIN";
    const isOwner = role === "PATIENT" && Number(userPatientId) === Number(req.params.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const result = await pool.query(
      `
      UPDATE patients
      SET name=$1,
          cpf=$2,
          email=$3
      WHERE id=$4
      RETURNING *
      `,
      [name, cpf, email, req.params.id]
    );

    await pool.query(
      `
      UPDATE users
      SET name=$1,
          email=$2
      WHERE patient_id=$3
      `,
      [name, email, req.params.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (somente ADMIN)
exports.deletePatient = async (req, res) => {
  const client = await pool.connect();

  try {
    const { role } = req.user;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Apenas admin pode excluir pacientes" });
    }

    await client.query("BEGIN");

    await client.query(
      "DELETE FROM users WHERE patient_id=$1",
      [req.params.id]
    );

    const result = await client.query(
      "DELETE FROM patients WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (!result.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    await client.query("COMMIT");

    res.json({ message: "Paciente removido com sucesso" });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};