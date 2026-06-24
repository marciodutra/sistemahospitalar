import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 REDIRECIONAMENTO POR PERFIL
      if (user.role === "admin") {
        window.location.href = "/dashboard";
        return;
      }

      if (user.role === "doctor") {
        window.location.href = "/doctor";
        return;
      }

      if (user.role === "patient") {
        window.location.href = "/patient";
        return;
      }

      // fallback
      window.location.href = "/dashboard";

    } catch (err) {
      setError(err.response?.data?.error || "Erro no login");
    }
  }

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100 justify-content-center align-items-center">

        <div className="col-md-4">
          <div className="card shadow-lg border-0">

            <div className="card-body p-5">

              <div className="text-center mb-4">
                <h1 className="text-primary">🏥</h1>
                <h3>Sistema hospitalar</h3>
                <p className="text-muted">
                  Faça login para acessar o sistema
                </p>
              </div>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>

                <div className="mb-3">
                  <label className="form-label">
                    E-mail
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Senha
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                >
                  Entrar
                </button>

              </form>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}