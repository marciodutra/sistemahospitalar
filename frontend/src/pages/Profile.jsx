import { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await api.get("/profile");
    setData(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    await api.put("/profile", {
      name: data.name,
      email: data.email,
    });

    alert("Perfil atualizado!");
  }

  async function changePassword() {
    await api.put("/profile/password", {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    alert("Senha alterada!");
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="container">

      <h3>Meu Perfil</h3>

      {/* AVATAR */}
      <div className="mb-3">
        <img
          src={data.avatar || "https://via.placeholder.com/120"}
          width="120"
          height="120"
          style={{ borderRadius: "50%" }}
        />
      </div>

      <input
        className="form-control mb-2"
        value={data.name || ""}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <input
        className="form-control mb-2"
        value={data.email || ""}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <button className="btn btn-primary mb-4" onClick={save}>
        Salvar perfil
      </button>

      <hr />

      <h5>Senha</h5>

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Senha atual"
        onChange={(e) =>
          setData({ ...data, currentPassword: e.target.value })
        }
      />

      <input
        type="password"
        className="form-control mb-2"
        placeholder="Nova senha"
        onChange={(e) =>
          setData({ ...data, newPassword: e.target.value })
        }
      />

      <button className="btn btn-warning" onClick={changePassword}>
        Alterar senha
      </button>
    </div>
  );
}