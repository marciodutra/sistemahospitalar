import { useEffect, useState } from "react";
import api from "../services/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");

  const [editingId, setEditingId] = useState(null);

  async function loadPatients() {
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/patients/${editingId}`, { name, cpf });
      } else {
        await api.post("/patients", { name, cpf });
      }

      setName("");
      setCpf("");
      setEditingId(null);
      loadPatients();
    } catch (err) {
      console.log(err);
    }
  }

  function editPatient(p) {
    setName(p.name);
    setCpf(p.cpf);
    setEditingId(p.id);
  }

  async function deletePatient(id) {
    try {
      await api.delete(`/patients/${id}`);
      loadPatients();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container">

      <h2 className="mb-4">👤 Pacientes</h2>

      {/* FORM */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body">

          <h5 className="mb-3">
            {editingId ? "Editar Paciente" : "Novo Paciente"}
          </h5>

          <form onSubmit={handleSubmit} className="row g-3">

            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Nome do paciente"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
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

        <div className="card-header bg-white">
          Lista de Pacientes
        </div>

        <div className="card-body p-0">

          <table className="table table-hover mb-0">

            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th width="200">Ações</th>
              </tr>
            </thead>

            <tbody>

              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.cpf}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => editPatient(p)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deletePatient(p.id)}
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