import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);

  async function loadData() {
  try {
    const patientsRes = await api.get("/patients");

    let usersRes = { data: [] };

    try {
      usersRes = await api.get("/users");
    } catch (err) {
      console.log("⚠️ /users ainda não existe no backend");
    }

    setPatients(patientsRes.data || []);
    setUsers(usersRes.data || []);

  } catch (err) {
    console.log("ERRO GERAL:", err);
  }
}

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>

      <h2 className="mb-4">📊 Dashboard Hospitalar</h2>

      {/* CARDS REAIS */}
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
              <h6 className="text-muted">Usuários</h6>
              <h2 className="fw-bold text-success">
                {users.length}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* LISTA REAL */}
      <div className="card shadow border-0">

        <div className="card-header bg-white">
          Últimos Pacientes
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
              {patients.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.cpf}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}