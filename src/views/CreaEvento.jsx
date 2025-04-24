// src/views/CreaEvento.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";

const CreaEvento = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titolo: "",
    descrizione: "",
    data: "",
    prezzo: "",
    immagine: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "immagine") {
      setForm({ ...form, immagine: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titolo", form.titolo);
    formData.append("descrizione", form.descrizione);
    formData.append("data", form.data);
    formData.append("prezzo", form.prezzo);
    formData.append("immagine", form.immagine);

    try {
      const res = await fetchWithAuth("/Evento", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Evento creato con successo!");
        navigate("/MieiEventi");
      } else {
        const error = await res.text();
        alert("Errore nella creazione: " + error);
      }
    } catch (err) {
      alert("Errore di rete: " + err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Crea Evento Privato</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Titolo</label>
          <input
            type="text"
            name="titolo"
            className="form-control"
            value={form.titolo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Descrizione</label>
          <textarea
            name="descrizione"
            className="form-control"
            value={form.descrizione}
            onChange={handleChange}
            rows={4}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Data</label>
          <input
            type="datetime-local"
            name="data"
            className="form-control"
            value={form.data}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Prezzo (€)</label>
          <input
            type="number"
            name="prezzo"
            className="form-control"
            value={form.prezzo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Immagine evento</label>
          <input
            type="file"
            name="immagine"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Crea Evento
        </button>
      </form>
    </div>
  );
};

export default CreaEvento;

