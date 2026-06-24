import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";

import Layout from "./components/Layout";

function Page({ element }) {
  return <Layout>{element}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<Page element={<Dashboard />} />} />
      <Route path="/patients" element={<Page element={<Patients />} />} />
      <Route path="/doctors" element={<Page element={<Doctors />} />} />
    </Routes>
  );
}