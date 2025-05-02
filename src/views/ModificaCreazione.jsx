// src/views/ModificaCreazione.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";

const ModificaCreazione = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nome: "", descrizione: "" });
  const [immagine, setImmagine] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    const fetchCreazione = async () => {
      const res = await fetchWithAuth(`/Creazione/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({ nome: data.nome, descrizione: data.descrizione });
        setPreview(`https://localhost:7081${data.immagine}`);
      } else {
        setErrore("Errore nel caricamento della ricetta.");
      }
    };
    fetchCreazione();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImmagine(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
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
      const errorText = await res.text();
      console.error("Errore nel backend:", errorText);
      setErrore("Errore: " + errorText);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Modifica Ricetta</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Titolo</label>
          <input
            type="text"
            name="nome"
            className="form-control"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Descrizione</label>
          <textarea
            name="descrizione"
            className="form-control"
            rows={5}
            value={form.descrizione}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Immagine </label>
          <input
            type="file"
            name="immagine"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="Anteprima"
              className="img-fluid rounded"
              style={{ maxHeight: "250px" }}
            />
          </div>
        )}

        {errore && <div className="text-danger mb-3">{errore}</div>}

        <button type="submit" className="btn btn-primary w-100">
          Salva modifiche
        </button>
      </form>
    </div>
  );
};

export default ModificaCreazione;
