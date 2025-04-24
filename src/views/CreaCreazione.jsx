import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";

const CreaCreazione = () => {
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [immagine, setImmagine] = useState(null);
  const [errore, setErrore] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !descrizione || !immagine) {
      setErrore("Tutti i campi sono obbligatori.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descrizione", descrizione);
    formData.append("immagine", immagine);

    try {
      const res = await fetchWithAuth("/Creazione", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        alert("Ricetta creata con successo!");
        navigate(`/creazione/${data.id}`);
      } else {
        const errorData = await res.text();
        setErrore("Errore: " + errorData);
      }
    } catch (err) {
      setErrore("Errore di rete: " + err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2>Nuova Ricetta</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Titolo</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Descrizione</label>
          <textarea
            className="form-control"
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            rows={5}
            required
          />
        </div>

        <div className="mb-3">
          <label>Immagine</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImmagine(e.target.files[0])}
            required
          />
        </div>

        {errore && <div className="text-danger mb-3">{errore}</div>}

        <button type="submit" className="btn btn-success w-100">
          Crea Ricetta
        </button>
      </form>
    </div>
  );
};

export default CreaCreazione;
