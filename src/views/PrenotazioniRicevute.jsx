import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useSelector } from "react-redux";

const PrenotazioniRicevute = () => {
  const user = useSelector((state) => state.user.user);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithAuth(`/Prenotazione/PrenotazioniRicevute/${user.id}`);

        if (res.ok) {
          const data = await res.json();
          setPrenotazioni(data);
        } else {
          setErrore("Errore nel caricamento delle prenotazioni.");
        }
      } catch (error) {
        console.error("Errore nella fetch delle prenotazioni ricevute:", error);
        setErrore("Errore nella connessione al server.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchData();
  }, [user]);

  if (loading) {
    return <div className="container mt-4">Caricamento in corso...</div>;
  }

  if (errore) {
    return <div className="container mt-4 text-danger">{errore}</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📋 Prenotazioni Ricevute</h3>
      {prenotazioni.length === 0 ? (
        <p>Nessuna prenotazione ricevuta per i tuoi eventi.</p>
      ) : (
        <ul className="list-group">
          {prenotazioni.map((p) => (
            <li key={p.id} className="list-group-item d-flex flex-column">
              <strong>Evento:</strong> {p.eventoTitolo}
              <strong>Utente:</strong> {p.utenteNome}
              <strong>Data Prenotazione:</strong> {new Date(p.dataPrenotazione).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrenotazioniRicevute;
