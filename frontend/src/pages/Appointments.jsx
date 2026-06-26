import { useEffect, useState } from "react";
import api from "../services/api";
import Select from "react-select";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // ---------------- LISTAR CONSULTAS ----------------
  async function loadAppointments() {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data || []);
    } catch (err) {
      console.error("appointments error:", err);
    }
  }

  // ---------------- PACIENTES (só ADMIN) ----------------
  async function loadPatients() {
    try {
      if (user?.role !== "ADMIN") return;

      const res = await api.get("/patients");
      setPatients(res.data || []);
    } catch (err) {
      console.error("patients error:", err);
    }
  }

  // ---------------- MÉDICOS (liberado) ----------------
  async function loadDoctors() {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data || []);
    } catch (err) {
      console.error("doctors error:", err);
    }
  }

  useEffect(() => {
    loadAppointments();
    loadPatients();
    loadDoctors();
  }, []);

  // ---------------- CRIAR CONSULTA ----------------
  async function createAppointment(e) {
    e.preventDefault();

    try {
      await api.post("/appointments", {
        patient_id:
          user?.role === "PATIENT" ? user.patient_id : patientId,

        doctor_id: doctorId,

        appointment_date: appointmentDate,

        status: "scheduled",
      });

      setPatientId("");
      setDoctorId("");
      setAppointmentDate("");
      setShowForm(false);

      loadAppointments();
    } catch (err) {
      console.error("create error:", err);
    }
  }

  // ---------------- STATUS ----------------
  async function updateStatus(id, status) {
    try {
      await api.put(`/appointments/${id}`, { status });
      loadAppointments();
    } catch (err) {
      console.error(err);
    }
  }

  // ---------------- OPTIONS ----------------
  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const doctorOptions = doctors.map((d) => ({
    value: d.id,
    label: `${d.name} - ${d.specialty}`,
  }));

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">📅 Consultas</h2>
          <p className="text-muted mb-0">
            Gerencie os agendamentos do hospital
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + Nova Consulta
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">Nova Consulta</h5>
          </div>

          <div className="card-body">
            <form onSubmit={createAppointment}>
              <div className="row">

                {/* PACIENTE só ADMIN */}
                {user?.role === "ADMIN" && (
                  <div className="col-md-4">
                    <label>Paciente</label>
                    <Select
                      options={patientOptions}
                      onChange={(s) => setPatientId(s?.value || "")}
                    />
                  </div>
                )}

                <div className="col-md-4">
                  <label>Médico</label>
                  <Select
                    options={doctorOptions}
                    onChange={(s) => setDoctorId(s?.value || "")}
                  />
                </div>

                <div className="col-md-4">
                  <label>Data</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>

              </div>

              <button className="btn btn-success mt-3">
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          Lista de Consultas
        </div>

        <div className="card-body p-0">
          <table className="table table-hover mb-0">

            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Especialidade</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.patient_name}</td>
                  <td>{a.doctor_name}</td>
                  <td>{a.doctor_specialty}</td>

                  <td>
                    {new Date(a.appointment_date).toLocaleString("pt-BR")}
                  </td>

                  <td>
                    {a.status === "scheduled" && (
                      <span className="badge bg-warning text-dark">
                        Agendada
                      </span>
                    )}

                    {a.status === "done" && (
                      <span className="badge bg-success">
                        Concluída
                      </span>
                    )}

                    {a.status === "canceled" && (
                      <span className="badge bg-danger">
                        Cancelada
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateStatus(a.id, "done")}
                    >
                      Concluir
                    </button>

                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => updateStatus(a.id, "canceled")}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}