import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";

const ModificaChefProfile = () => {
  const user = useSelector((state) => state.user.user);
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    bio: "",
    città: "",
    immagineProfilo: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const res = await fetchWithAuth(`/Chef/byUser/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setForm(data);
        }
      } catch (err) {
        console.error("Errore nel caricamento del profilo:", err);
      }
    };

    if (user?.id) fetchChef();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth(`/Chef/${form.id}`, {
        method: "PUT",
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("Profilo aggiornato con successo.");
        navigate("/ChefProfile");
      } else {
        alert("Errore nell'aggiornamento del profilo.");
      }
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2>Modifica Profilo Chef</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Cognome</label>
          <input name="cognome" value={form.cognome} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" value={form.email} disabled className="form-control" />
        </div>
        <div className="mb-3">
          <label>Biografia</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Città</label>
          <input name="città" value={form.città} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label>URL Immagine Profilo</label>
          <input name="immagineProfilo" value={form.immagineProfilo} onChange={handleChange} className="form-control" />
        </div>
        <button className="btn btn-primary w-100">Salva modifiche</button>
      </form>
    </div>
  );
};

export default ModificaChefProfile;
