// src/views/ModificaCreazione.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";

const ModificaCreazione = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", descrizione: "" });
  const [immagine, setImmagine] = useState(null);

  useEffect(() => {
    const fetchCreazione = async () => {
      const res = await fetchWithAuth(`/Creazione/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({ nome: data.nome, descrizione: data.descrizione });
      }
    };
    fetchCreazione();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImmagine(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", form.nome);
    formData.append("descrizione", form.descrizione);
    if (immagine) {
      formData.append("immagine", immagine);
    }

    const res = await fetchWithAuth(`/Creazione/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      alert("Ricetta modificata con successo");
      navigate(`/creazione/${id}`);
    } else {
      alert("Errore nella modifica");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2>Modifica Ricetta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nome</label>
          <input
            name="nome"
            className="form-control"
            value={form.nome}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Descrizione</label>
          <textarea
            name="descrizione"
            className="form-control"
            rows="4"
            value={form.descrizione}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label>Immagine (opzionale)</label>
          <input
            type="file"
            name="immagine"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Salva modifiche</button>
      </form>
    </div>
  );
};

export default ModificaCreazione;
