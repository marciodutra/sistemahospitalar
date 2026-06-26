import { useState } from "react";
import api from "../services/api";

export default function Profile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert("As senhas não conferem.");
    }

    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      alert("Senha alterada com sucesso!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      alert(err.response?.data?.error || "Erro ao alterar senha.");
    }
  }

  return (
    <div className="container">

      <div className="card shadow-sm">
        <div className="card-header">
          <h4>Alterar Senha</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Senha Atual</label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nova Senha</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary">
              Alterar Senha
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}