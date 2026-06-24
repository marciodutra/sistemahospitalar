const db = require("../config/database");

// LISTAR
exports.getAllAppointments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        a.*,
        p.name as patient_name,
        d.name as doctor_name
      FROM appointments a
      JOIN patients p ON p.id = a.patient_id
      JOIN doctors d ON d.id = a.doctor_id
      ORDER BY a.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CRIAR
exports.createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, status } = req.body;

    const result = await db.query(
      `INSERT INTO appointments 
       (patient_id, doctor_id, appointment_date, status)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [patient_id, doctor_id, appointment_date, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ATUALIZAR
exports.updateAppointment = async (req, res) => {
  try {
    const { status } = req.body;

    const result = await db.query(
      `UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETAR
exports.deleteAppointment = async (req, res) => {
  try {
    await db.query(`DELETE FROM appointments WHERE id = $1`, [
      req.params.id,
    ]);

    res.json({ message: "Consulta removida com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};