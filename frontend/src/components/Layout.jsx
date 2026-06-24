import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex">

      {/* SIDEBAR */}
      <div
        className="bg-dark text-white p-3 shadow"
        style={{ width: "260px", minHeight: "100vh" }}
      >
        <h4 className="mb-4 fw-bold">🏥 Hospital System</h4>

        <div className="d-flex flex-column gap-2">

          <Link
            to="/dashboard"
            className={`nav-link text-white p-2 rounded ${
              isActive("/dashboard") ? "bg-primary" : ""
            }`}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/patients"
            className={`nav-link text-white p-2 rounded ${
              isActive("/patients") ? "bg-primary" : ""
            }`}
          >
            👤 Pacientes
          </Link>

          <Link
            to="/doctors"
            className={`nav-link text-white p-2 rounded ${
              isActive("/doctors") ? "bg-primary" : ""
            }`}
          >
            🩺 Médicos
          </Link>

          <Link
            to="/appointments"
            className={`nav-link text-white p-2 rounded ${
              isActive("/appointments") ? "bg-primary" : ""
            }`}
          >
            📅 Consultas
          </Link>

          <Link
            to="/users"
            className={`nav-link text-white p-2 rounded ${
              isActive("/users") ? "bg-primary" : ""
            }`}
          >
            👥 Usuários
          </Link>

        </div>

        <hr className="text-secondary" />

        <button
          className="btn btn-danger w-100 mt-3"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          🚪 Sair
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-grow-1 bg-light">

        {/* TOP BAR */}
        <div className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Sistema Hospitalar</h5>

          <span className="text-muted small">
            usuário logado
          </span>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-4">
          {children}
        </div>

      </div>

    </div>
  );
}