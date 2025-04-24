import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

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

      <div className="row mb-3">
        <div className="col-md-6">
          <label>Filtra per Data:</label>
          <input type="date" className="form-control" value={dataFiltro} onChange={(e) => setDataFiltro(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label>Prezzo Massimo:</label>
          <input type="number" className="form-control" value={prezzoMax} onChange={(e) => setPrezzoMax(e.target.value)} />
        </div>
      </div>

      <div className="row">
        {eventiFiltrati.map((evento) => (
          <div className="col-md-6 mb-4" key={evento.id}>
            <div className="card shadow h-100">
              {evento.immagine && (
                <img
                  src={`https://localhost:7081${evento.immagine}`}
                  className="card-img-top"
                  alt="evento"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5>{evento.titolo}</h5>
                <p>{evento.descrizione}</p>
                <p><strong>Data:</strong> {new Date(evento.data).toLocaleDateString()}</p>
                <p><strong>Prezzo:</strong> €{evento.prezzo}</p>
                <p>
                  <strong>Chef:</strong>{" "}
                  <span
                    className="text-primary"
                    role="button"
                    onClick={() => navigate(`/chef/${evento.chefId}`)} 


                    style={{ textDecoration: "underline" }}
                  >
                    {evento.chefNome}
                  </span>
                </p>

                <div className="d-flex justify-content-between mt-3">
               
                  {user && (
                    prenotati.includes(evento.id) ? (
                      <button className="btn btn-danger" onClick={() => handleCancella(evento.id)}>Cancella Prenotazione</button>
                    ) : (
                      <button className="btn btn-success" onClick={() => handlePrenota(evento.id)}>Prenota</button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Eventi;
