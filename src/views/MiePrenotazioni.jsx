import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useSelector } from "react-redux";

const MiePrenotazioni = () => {
  const user = useSelector((state) => state.user.user);
  const [prenotazioni, setPrenotazioni] = useState([]);

  const fetchPrenotazioni = async () => {
    const res = await fetchWithAuth(`/Prenotazione/utente/${user.id}`);
    if (res.ok) {
      const data = await res.json();
      setPrenotazioni(data);
    }
  };

  useEffect(() => {
    if (user?.id) fetchPrenotazioni();
  }, [user]);

  const handleCancella = async (idPrenotazione) => {
    const conferma = window.confirm("Sei sicuro di voler cancellare la prenotazione?");
    if (!conferma) return;

    const res = await fetchWithAuth(`/Prenotazione/${idPrenotazione}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Prenotazione cancellata.");
      // Aggiorna la lista senza la prenotazione cancellata
      setPrenotazioni((prev) => prev.filter((p) => p.id !== idPrenotazione));
    } else {
      alert("Errore nella cancellazione.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Le mie prenotazioni</h3>
      {prenotazioni.length === 0 ? (
        <p>Nessuna prenotazione effettuata.</p>
      ) : (
        <ul className="list-group">
          {prenotazioni.map((p) => (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                Evento: {p.eventoTitolo} • Data prenotazione:{" "}
                {new Date(p.dataPrenotazione).toLocaleDateString()}
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleCancella(p.id)}
              >
                Cancella
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MiePrenotazioni;
