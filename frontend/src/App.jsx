import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";

import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Profile from "./pages/Profile";

function Private({ children }) {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "/";
    return null;
  }

  return children;
}

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <Private>
            <Layout><Dashboard /></Layout>
          </Private>
        }
      />

      <Route
        path="/patients"
        element={
          <Private>
            <Layout><Patients /></Layout>
          </Private>
        }
      />

      <Route
        path="/doctors"
        element={
          <Private>
            <Layout><Doctors /></Layout>
          </Private>
        }
      />

      <Route
        path="/appointments"
        element={
          <Private>
            <Layout><Appointments /></Layout>
          </Private>
        }
      />

      {/* 🔥 ROTAS NOVAS (IMPORTANTE) */}
      <Route
        path="/doctor"
        element={
          <Private>
            <Layout><DoctorDashboard /></Layout>
          </Private>
        }
      />

      <Route
        path="/patient"
        element={
          <Private>
            <Layout><PatientDashboard /></Layout>
          </Private>
        }
      />

      <Route
        path="/profile"
        element={
          <Private>
            <Layout>
              <Profile />
            </Layout>
          </Private>
        }
      />

    </Routes>
  );
}