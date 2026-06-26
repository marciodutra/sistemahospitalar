import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const isActive = (path) => location.pathname === path;

  // 🔥 CONFIG PROFISSIONAL DE PERFIL
  const roleConfig = {
    ADMIN: {
      label: "Administrador",
      color: "danger",
    },
    DOCTOR: {
      label: "Médico",
      color: "primary",
    },
    PATIENT: {
      label: "Paciente",
      color: "success",
    },
  };

  const roleInfo = roleConfig[user?.role] || {
    label: user?.role,
    color: "secondary",
  };

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
            to="/profile"
            className={`nav-link text-white p-2 rounded ${
              isActive("/profile") ? "bg-primary" : ""
            }`}
          >
            🔐 Meu Perfil
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

          <div className="d-flex align-items-center gap-2">

            <span className="text-muted small">
              {user?.name}
            </span>

            <span className={`badge bg-${roleInfo.color}`}>
              {roleInfo.label}
            </span>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="p-4">
          {children}
        </div>

      </div>

    </div>
  );
}