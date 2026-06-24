import { useEffect, useState } from "react";
import api from "../services/api";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState("");
  const [crm, setCrm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function loadDoctors() {
    const res = await api.get("/doctors");
    setDoctors(res.data);
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (editingId) {
      await api.put(`/doctors/${editingId}`, {
        name,
        crm,
        specialty
      });
    } else {
      await api.post("/doctors", {
        name,
        crm,
        specialty
      });
    }

    setName("");
    setCrm("");
    setSpecialty("");
    setEditingId(null);

    loadDoctors();
  }

  function editDoctor(d) {
    setName(d.name);
    setCrm(d.crm);
    setSpecialty(d.specialty);
    setEditingId(d.id);
  }

  async function deleteDoctor(id) {
    await api.delete(`/doctors/${id}`);
    loadDoctors();
  }

  return (
    <div>
      <h2 className="mb-4">🩺 Médicos</h2>

      {/* FORM */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-2">

            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="CRM"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Especialidade"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-grid">
              <button className="btn btn-primary">
                {editingId ? "Atualizar" : "Salvar"}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow border-0">
        <div className="card-body p-0">

          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CRM</th>
                <th>Especialidade</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.crm}</td>
                  <td>{d.specialty}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => editDoctor(d)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteDoctor(d.id)}
                    >
                      Excluir
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