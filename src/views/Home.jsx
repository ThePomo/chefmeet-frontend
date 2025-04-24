import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [contenuti, setContenuti] = useState([]);
  const [ricetteTop, setRicetteTop] = useState([]);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [likeUtente, setLikeUtente] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDati = async () => {
      const resEventi = await fetchWithAuth("/Evento");
      const resRicette = await fetchWithAuth("/Creazione");

      if (resEventi.ok && resRicette.ok) {
        const eventi = await resEventi.json();
        const ricette = await resRicette.json();

        const eventiConTipo = eventi.map((e) => ({ ...e, tipo: "evento" }));
        const ricetteConTipo = ricette.map((r) => ({ ...r, tipo: "ricetta" }));

        const unione = [...eventiConTipo, ...ricetteConTipo];
        const ordinati = unione.sort((a, b) => new Date(b.data) - new Date(a.data));
        setContenuti(ordinati);

        const ricetteRandom = ricette.sort(() => 0.5 - Math.random()).slice(0, 3);
        setRicetteTop(ricetteRandom);
      }

      if (user) {
        const resPren = await fetchWithAuth(`/Prenotazione/utente/${user.id}`);
        if (resPren.ok) {
          const pren = await resPren.json();
          setPrenotazioni(pren.map((p) => p.eventoId));
        }

        const resLike = await fetchWithAuth(`/Like/utente/${user.id}`);
        if (resLike.ok) {
          const likes = await resLike.json();
          setLikeUtente(likes.map((l) => l.creazioneId));
        }
      }
    };

    fetchDati();
  }, []);

  const handlePrenota = async (eventoId) => {
    const res = await fetchWithAuth("/Prenotazione", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventoId),
    });
    if (res.ok) {
      setPrenotazioni((prev) => [...prev, eventoId]);
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
          setPrenotazioni((prev) => prev.filter((id) => id !== eventoId));
        }
      }
    }
  };

  const handleLike = async (creazioneId) => {
    const alreadyLiked = likeUtente.includes(creazioneId);
    if (alreadyLiked) {
      const res = await fetchWithAuth(`/Like/utente/${user.id}`);
      if (res.ok) {
        const likeData = await res.json();
        const like = likeData.find((l) => l.creazioneId === creazioneId);
        if (like) {
          await fetchWithAuth(`/Like/${like.id}`, { method: "DELETE" });
          setLikeUtente((prev) => prev.filter((id) => id !== creazioneId));
        }
      }
    } else {
      const res = await fetchWithAuth("/Like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creazioneId }),
      });
      if (res.ok) {
        setLikeUtente((prev) => [...prev, creazioneId]);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Colonna sinistra */}
        <div className="col-md-2 d-none d-md-block"></div>

        {/* Colonna centrale */}
        <div className="col-md-7">
          <h3 className="mb-4">📰 Ultime novità</h3>
          {contenuti.map((item) => (
            <div key={`${item.tipo}-${item.id}`} className="card mb-4 shadow-sm">
              {item.immagine && (
                <img
                  src={`https://localhost:7081${item.immagine}`}
                  className="card-img-top"
                  alt={item.titolo || item.nome}
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">
                  {item.tipo === "ricetta" ? (
                    <span
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={() => navigate(`/creazione/${item.id}`)}
                    >
                      {item.nome}
                    </span>
                  ) : (
                    item.titolo
                  )}
                </h5>
                <p className="card-text">{item.descrizione}</p>
                <p className="text-muted mb-1">
                  {item.tipo === "evento" ? "Evento" : "Ricetta"} •{" "}
                  {new Date(item.data).toLocaleDateString()}
                </p>
                <p className="text-muted">
                  {item.tipo === "evento" ? (
                    <span
                      style={{ cursor: "pointer", color: "darkred", textDecoration: "underline" }}
                      onClick={() => navigate(`/chef/${item.chefUserId}`)}
                    >
                      Chef: {item.chefNome}
                    </span>
                  ) : (
                    <span
                      style={{ cursor: "pointer", color: "darkgreen", textDecoration: "underline" }}
                      onClick={() => navigate(`/utente/${item.creatoreId}`)}
                    >
                      Autore: {item.autore}
                    </span>
                  )}
                </p>

                {/* Azioni */}
                {item.tipo === "evento" && user && (
                  prenotazioni.includes(item.id) ? (
                    <button className="btn btn-danger me-2" onClick={() => handleCancella(item.id)}>
                      Cancella Prenotazione
                    </button>
                  ) : (
                    <button className="btn btn-success me-2" onClick={() => handlePrenota(item.id)}>
                      Prenota
                    </button>
                  )
                )}

                {item.tipo === "ricetta" && user && (
                  <button
                    className={`btn ${likeUtente.includes(item.id) ? "btn-outline-danger" : "btn-outline-secondary"}`}
                    onClick={() => handleLike(item.id)}
                  >
                    ❤️ {likeUtente.includes(item.id) ? "Non mi piace più" : "Like"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Colonna destra */}
        <div className="col-md-3">
          <h4 className="mb-3">🍝 Le ricette più interessanti</h4>
          {ricetteTop.map((ricetta) => (
            <div key={ricetta.id} className="card mb-3 shadow-sm">
              {ricetta.immagine && (
                <img
                  src={`https://localhost:7081${ricetta.immagine}`}
                  className="card-img-top"
                  alt={ricetta.nome}
                  style={{ height: "150px", objectFit: "cover" }}
                />
              )}
              <div className="card-body p-2">
                <h6
                  className="card-title text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/creazione/${ricetta.id}`)}
                >
                  {ricetta.nome}
                </h6>
                <small className="text-muted">{new Date(ricetta.data).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
