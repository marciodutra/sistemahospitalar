import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  async function loadData() {
    try {
      const patientsRes = await api.get("/patients");
      const doctorsRes = await api.get("/doctors");

      setPatients(patientsRes.data || []);
      setDoctors(doctorsRes.data || []);
    } catch (err) {
      console.log("ERRO:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredDoctors = doctors.filter((d) =>
    d.name?.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4">📊 Dashboard Hospitalar</h2>

      {/* CARDS */}
      <div className="row g-3 mb-4">

        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Pacientes</h6>
              <h2 className="fw-bold text-primary">
                {patients.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Médicos</h6>
              <h2 className="fw-bold text-success">
                {doctors.length}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* PACIENTES */}
      <div className="card shadow border-0 mb-4">

        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <span>👤 Pacientes</span>

          <input
            type="text"
            className="form-control w-25"
            placeholder="Pesquisar paciente..."
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
          />
        </div>

        <div className="card-body p-0">

          <table className="table table-hover mb-0">

            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-3">
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              ) : (
                filteredPatients.slice(0, 10).map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.cpf}</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      </div>

      {/* MÉDICOS */}
      <div className="card shadow border-0">

        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <span>🩺 Médicos</span>

          <input
            type="text"
            className="form-control w-25"
            placeholder="Pesquisar médico..."
            value={doctorSearch}
            onChange={(e) => setDoctorSearch(e.target.value)}
          />
        </div>

        <div className="card-body p-0">

          <table className="table table-hover mb-0">

            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Especialidade</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-3">
                    Nenhum médico encontrado.
                  </td>
                </tr>
              ) : (
                filteredDoctors.slice(0, 10).map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.specialty}</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}