import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useSelector } from "react-redux";

const PrenotazioniRicevute = () => {
  const user = useSelector((state) => state.user.user);
  const [prenotazioni, setPrenotazioni] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchWithAuth(`/Evento/PrenotazioniRicevute/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setPrenotazioni(data);
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  return (
    <div className="container mt-4">
      <h3>Prenotazioni ricevute</h3>
      {prenotazioni.length === 0 ? (
        <p>Nessuna prenotazione ricevuta.</p>
      ) : (
        <ul className="list-group">
          {prenotazioni.map((p) => (
            <li key={p.id} className="list-group-item">
              Evento: {p.eventoTitolo} • Utente: {p.utenteNome} • Data:{" "}
              {new Date(p.dataPrenotazione).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrenotazioniRicevute;
