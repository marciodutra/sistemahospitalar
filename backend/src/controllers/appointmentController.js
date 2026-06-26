const { pool } = require("../config/database");

// LISTAR CONSULTAS (COM PERMISSÃO)
exports.getAllAppointments = async (req, res) => {
  try {
    const { role, doctor_id, patient_id } = req.user;

    let result;

    // ADMIN → tudo
    if (role === "admin") {
      result = await pool.query(`
      SELECT 
        a.*,
        p.name as patient_name,
        d.name as doctor_name,
        d.specialty as doctor_specialty
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      JOIN doctors d ON d.id = a.doctor_id
      ORDER BY a.id DESC
    `);
    }

    // DOCTOR → apenas suas consultas
    else if (role === "DOCTOR") {
      result = await pool.query(`
      SELECT 
        a.*,
        p.name as patient_name,
        d.name as doctor_name,
        d.specialty as doctor_specialty
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.doctor_id = $1
      ORDER BY a.id DESC
    `, [doctor_id]);
    }

    // PATIENT → apenas suas consultas
    else if (role === "PATIENT") {
      result = await pool.query(`
      SELECT 
        a.*,
        p.name as patient_name,
        d.name as doctor_name,
        d.specialty as doctor_specialty
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.patient_id = $1
      ORDER BY a.id DESC
    `, [patient_id]);
    }

    else {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json(result.rows);

  } catch (err) {
    console.error("ERRO LISTAR CONSULTAS:", err);
    res.status(500).json({ error: err.message });
  }
};

// CRIAR CONSULTA
exports.createAppointment = async (req, res) => {
  try {
    const { role, doctor_id } = req.user;

    let { patient_id, doctor_id: bodyDoctorId, appointment_date, status } = req.body;

    if (!patient_id || !appointment_date) {
      return res.status(400).json({
        error: "Campos obrigatórios faltando"
      });
    }

    // regra de segurança:
    // DOCTOR só pode criar consulta para ele mesmo
    const finalDoctorId = role === "DOCTOR" ? doctor_id : bodyDoctorId;

    if (!finalDoctorId) {
      return res.status(400).json({
        error: "doctor_id obrigatório"
      });
    }

    patient_id = Number(patient_id);
    const docId = Number(finalDoctorId);

    appointment_date = appointment_date.includes("T")
      ? appointment_date.replace("T", " ") + ":00"
      : appointment_date;

    const result = await pool.query(`
      INSERT INTO appointments 
      (patient_id, doctor_id, appointment_date, status)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `, [
      patient_id,
      docId,
      appointment_date,
      status || "scheduled"
    ]);

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("ERRO AO CRIAR CONSULTA:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE CONSULTA (ADMIN OU DONO)
exports.updateAppointment = async (req, res) => {
  try {
    const { role, doctor_id, patient_id } = req.user;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status obrigatório" });
    }

    const appointment = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [req.params.id]
    );

    if (!appointment.rows.length) {
      return res.status(404).json({ error: "Consulta não encontrada" });
    }

    const appt = appointment.rows[0];

    // permissões
    const isDoctorOwner = role === "DOCTOR" && appt.doctor_id === doctor_id;
    const isPatientOwner = role === "PATIENT" && appt.patient_id === patient_id;

    if (role !== "ADMIN" && !isDoctorOwner && !isPatientOwner) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const result = await pool.query(
      `UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("ERRO AO ATUALIZAR:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE CONSULTA
exports.deleteAppointment = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Apenas admin pode excluir consultas" });
    }

    const result = await pool.query(
      `DELETE FROM appointments WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Consulta não encontrada" });
    }

    res.json({ message: "Consulta removida com sucesso" });

  } catch (err) {
    console.error("ERRO AO DELETAR:", err);
    res.status(500).json({ error: err.message });
  }
};