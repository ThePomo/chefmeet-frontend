// src/components/PrenotaDisponibilita.jsx
import React from "react";
import { fetchWithAuth } from "../utils/api";

const PrenotaDisponibilita = ({ disponibilitaId, onPrenotato }) => {
  const handlePrenotazione = async () => {
    if (!window.confirm("Vuoi davvero prenotare questa data?")) return;

    try {
      const res = await fetchWithAuth("/PrenotazioniDisponibilita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponibilitaChefId: disponibilitaId }),
      });

      if (res.ok) {
        alert("Prenotazione completata!");
        if (onPrenotato) onPrenotato();
      } else {
        const err = await res.text();
        alert("Errore durante la prenotazione: " + err);
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      alert("Errore di rete durante la prenotazione.");
    }
  };

  return (
    <button className="btn btn-primary btn-sm" onClick={handlePrenotazione}>
      Prenota
    </button>
  );
};

export default PrenotaDisponibilita;
