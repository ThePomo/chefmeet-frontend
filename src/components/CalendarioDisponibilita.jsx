// src/components/CalendarioDisponibilita.jsx
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";

const CalendarioDisponibilita = () => {
  const [disponibilita, setDisponibilita] = useState([]);
  const [form, setForm] = useState({
    data: "",
    oraInizio: "",
    oraFine: "",
    èDisponibile: true,
  });

  const caricaDisponibilita = async () => {
    try {
      const res = await fetchWithAuth("/Disponibilita");
      if (res.ok) {
        const data = await res.json();
        setDisponibilita(data);
      }
    } catch (err) {
      console.error("Errore caricamento disponibilità:", err);
    }
  };

  useEffect(() => {
    caricaDisponibilita();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Assicura formato HH:mm:ss per TimeSpan
    const payload = {
      data: form.data,
      oraInizio: `${form.oraInizio}:00`,
      oraFine: `${form.oraFine}:00`,
      èDisponibile: form.èDisponibile,
    };

    try {
      const res = await fetchWithAuth("/Disponibilita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Disponibilità aggiunta!");
        setForm({ data: "", oraInizio: "", oraFine: "", èDisponibile: true });
        caricaDisponibilita();
      } else {
        const error = await res.text();
        alert("Errore: " + error);
      }
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa disponibilità?")) return;

    try {
      const res = await fetchWithAuth(`/Disponibilita/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Disponibilità eliminata.");
        caricaDisponibilita();
      }
    } catch (err) {
      console.error("Errore durante l'eliminazione:", err);
    }
  };

  return (
    <div className="mt-5">
      <h4>Disponibilità dello Chef</h4>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-4">
            <label>Data</label>
            <input type="date" name="data" className="form-control" value={form.data} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label>Ora Inizio</label>
            <input type="time" name="oraInizio" className="form-control" value={form.oraInizio} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label>Ora Fine</label>
            <input type="time" name="oraFine" className="form-control" value={form.oraFine} onChange={handleChange} required />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">Aggiungi</button>
          </div>
        </div>
      </form>

      <ul className="list-group">
        {disponibilita.map((d, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {new Date(d.data).toLocaleDateString()} | {d.oraInizio} - {d.oraFine}
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.id)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarioDisponibilita;

