import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Eventi = () => {
  const [eventi, setEventi] = useState([]);
  const [prenotati, setPrenotati] = useState([]);
  const [dataFiltro, setDataFiltro] = useState("");
  const [prezzoMax, setPrezzoMax] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchEventi = async () => {
      const res = await fetchWithAuth("/Evento");
      if (res.ok) {
        const data = await res.json();
        setEventi(data);
      }
    };

    const fetchPrenotazioni = async () => {
      if (!user) return;
      const res = await fetchWithAuth(`/Prenotazione/utente/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setPrenotati(data.map((p) => p.eventoId));
      }
    };

    fetchEventi();
    fetchPrenotazioni();
  }, []);

  const handlePrenota = async (eventoId) => {
    const res = await fetchWithAuth("/Prenotazione", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventoId),
    });
    if (res.ok) {
      alert("Prenotazione effettuata con successo.");
      setPrenotati((prev) => [...prev, eventoId]);
    }
  };

  const handleCancella = async (eventoId) => {
    const res = await fetchWithAuth(`/Prenotazione/utente/${user.id}`);
    if (res.ok) {
      const data = await res.json();
      const pren = data.find((p) => p.eventoId === eventoId);
      if (pren) {
        const resDelete = await fetchWithAuth(`/Prenotazione/${pren.id}`, {
          method: "DELETE",
        });
        if (resDelete.ok) {
          alert("Prenotazione cancellata.");
          setPrenotati((prev) => prev.filter((id) => id !== eventoId));
        }
      }
    }
  };

  const eventiFiltrati = eventi.filter((e) => {
    const matchData = !dataFiltro || e.data.startsWith(dataFiltro);
    const matchPrezzo = !prezzoMax || e.prezzo <= parseFloat(prezzoMax);
    return matchData && matchPrezzo;
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Eventi Disponibili</h2>
      <div className="gronda-filtri mb-4">
  <div className="form-group me-3 mb-2">
    <label className="form-label">📅 Data</label>
    <input
      type="date"
      className="form-control"
      value={dataFiltro}
      onChange={(e) => setDataFiltro(e.target.value)}
    />
  </div>
  <div className="form-group mb-2">
    <label className="form-label">💰 Prezzo massimo</label>
    <input
      type="number"
      className="form-control"
      value={prezzoMax}
      onChange={(e) => setPrezzoMax(e.target.value)}
    />
  </div>
</div>


      <div className="gronda-grid">
        {eventiFiltrati.map((evento) => (
          <div key={evento.id} className="card-creazione">
          <div
            className="position-relative"
            onClick={() => navigate(`/evento/${evento.id}`)}
            style={{ cursor: "pointer" }}
          >
            {evento.immagine && (
              <img
                src={`https://localhost:7081${evento.immagine}`}
                alt={evento.titolo}
              />
            )}
          </div>
          <div className="card-creazione-body">
            <h5
              className="text-success"
              style={{ cursor: "pointer", }}
              onClick={() => navigate(`/evento/${evento.id}`)}
            >
              {evento.titolo}
            </h5>
            <p className="mb-1">{evento.descrizione}</p>
            <p className="mb-1">
              <strong>Data:</strong> {new Date(evento.data).toLocaleDateString()}
            </p>
            <p className="mb-1">
              <strong>Prezzo:</strong> €{evento.prezzo}
            </p>
            <p className="mb-2">
              <strong>Chef:</strong>{" "}
              <span
                className="text-success"
                style={{ cursor: "pointer", }}
                onClick={() => navigate(`/chef/${evento.chefUserId}`)}
              >
                {evento.chefNome}
              </span>
            </p>
            {user && (
              prenotati.includes(evento.id) ? (
                <button className="btn btn-danger btn-sm w-100" onClick={() => handleCancella(evento.id)}>
                  Cancella Prenotazione
                </button>
              ) : (
                <button className="btn btn-success btn-sm w-100" onClick={() => handlePrenota(evento.id)}>
                  Prenota
                </button>
              )
            )}
          </div>
        </div>
        
        ))}
      </div>
    </div>
  );
};

export default Eventi;
