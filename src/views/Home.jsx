import React, { useEffect, useState, useRef } from "react";
import { fetchWithAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";
import logoChefMeet from "../assets/img/1logocheefmeetcompleto.png";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  const [contenuti, setContenuti] = useState([]);
  const [ricetteTop, setRicetteTop] = useState([]);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [likeUtente, setLikeUtente] = useState([]);

  const ricetteTopRef = useRef(null);

  // 🔁 Monitora il localStorage per logout/login
  useEffect(() => {
    const interval = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDati = async () => {
      try {
        const [resEventi, resRicette, resPren, resLike] = await Promise.all([
          fetchWithAuth("/Evento"),
          fetchWithAuth("/Creazione"),
          fetchWithAuth(`/Prenotazione/utente/${user.id}`),
          fetchWithAuth(`/Like/utente/${user.id}`),
        ]);

        if (resEventi.ok && resRicette.ok) {
          const eventi = await resEventi.json();
          const ricette = await resRicette.json();

          const eventiConTipo = eventi.map((e) => ({ ...e, tipo: "evento" }));
          const ricetteConTipo = ricette.map((r) => ({
            ...r,
            tipo: "ricetta",
          }));

          const unione = [...eventiConTipo, ...ricetteConTipo];
          const ordinati = unione.sort(
            (a, b) => new Date(b.data) - new Date(a.data)
          );
          setContenuti(ordinati);

          if (!ricetteTopRef.current) {
            const ricetteCopy = [...ricette];
            for (let i = ricetteCopy.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [ricetteCopy[i], ricetteCopy[j]] = [
                ricetteCopy[j],
                ricetteCopy[i],
              ];
            }
            ricetteTopRef.current = ricetteCopy.slice(0, 3);
          }
          setRicetteTop(ricetteTopRef.current);
        }

        if (resPren.ok) {
          const pren = await resPren.json();
          setPrenotazioni(pren.map((p) => p.eventoId));
        }

        if (resLike.ok) {
          const likes = await resLike.json();
          setLikeUtente(likes.map((l) => l.creazioneId));
        }
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
      }
    };

    fetchDati();
  }, [user?.id]);

  const handlePrenota = async (eventoId) => {
    try {
      const res = await fetchWithAuth("/Prenotazione", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventoId),
      });
      if (res.ok) {
        setPrenotazioni((prev) => [...prev, eventoId]);
      }
    } catch (error) {
      console.error("Errore nella prenotazione", error);
    }
  };

  const handleCancella = async (eventoId) => {
    try {
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
    } catch (error) {
      console.error("Errore nella cancellazione", error);
    }
  };

  const handleLike = async (creazioneId) => {
    if (!user) return;

    const alreadyLiked = likeUtente.includes(creazioneId);

    if (alreadyLiked) {
      try {
        const resDelete = await fetchWithAuth(`/Like/${creazioneId}`, {
          method: "DELETE",
        });
        if (resDelete.ok || resDelete.status === 404) {
          setLikeUtente((prev) => prev.filter((id) => id !== creazioneId));
        }
      } catch (error) {
        console.error("Errore nel DELETE like:", error);
      }
    } else {
      try {
        const res = await fetchWithAuth(`/Like/${creazioneId}`, {
          method: "POST",
        });
        if (res.ok) {
          setLikeUtente((prev) => [...prev, creazioneId]);
        }
      } catch (error) {
        console.error("Errore nel POST like:", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <img
          src={logoChefMeet}
          alt="ChefMeet Logo"
          style={{ maxWidth: "500px", width: "100%" }}
          className="mb-4"
        />
        <h2>Benvenuto su ChefMeet!</h2>
        <p>
          Accedi o registrati per scoprire eventi, chef e ricette da tutto il
          mondo!
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-2 d-none d-md-block" />
        <div className="col-md-7">
          <h3 className="mb-4">📰 Ultime novità</h3>
          {contenuti.map((item) => (
            <div
              key={`${item.tipo}-${item.id}`}
              className="card mb-4 shadow-sm"
            >
              {item.immagine && (
                <img
                  src={`https://localhost:7081${item.immagine}`}
                  className="card-img-top"
                  alt={item.nome || item.titolo}
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
                <p className="card-text" style={{ whiteSpace: "pre-line" }}>
  {item.descrizione}
</p>

                {item.tipo === "evento" && (
                  <p className="mb-1">
                    📅 Data dell'evento •{" "}
                    {new Date(item.data).toLocaleDateString()}
                  </p>
                )}

                <p className="text-muted">
                  {item.tipo === "evento" ? (
                    <span
                      style={{ cursor: "pointer", color: "darkred" }}
                      onClick={() => navigate(`/chef/${item.chefUserId}`)}
                    >
                      Chef: {item.chefNome}
                    </span>
                  ) : (
                    <span
                      style={{ cursor: "pointer", color: "darkgreen" }}
                      onClick={() => navigate(`/utente/${item.creatoreId}`)}
                    >
                      Autore: {item.autore}
                    </span>
                  )}
                </p>

                {item.tipo === "evento" &&
                  (prenotazioni.includes(item.id) ? (
                    <button
                      className="btn btn-danger me-2"
                      onClick={() => handleCancella(item.id)}
                    >
                      Cancella Prenotazione
                    </button>
                  ) : (
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handlePrenota(item.id)}
                    >
                      Prenota
                    </button>
                  ))}
                {item.tipo === "ricetta" && (
                  <button
                    className={`btn ${
                      likeUtente.includes(item.id)
                        ? "btn-danger"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => handleLike(item.id)}
                  >
                    ❤️{" "}
                    {likeUtente.includes(item.id) ? "Non mi piace più" : "Like"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

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
                  className="card-title"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/creazione/${ricetta.id}`)}
                >
                  {ricetta.nome}
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
