import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../app.css";

const Ricettario = () => {
  const [ricette, setRicette] = useState([]);
  const [soloChef, setSoloChef] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [likeUtente, setLikeUtente] = useState([]);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const fetchRicette = async () => {
    try {
      let url = "/Creazione/ricettario";
      const params = [];
      if (soloChef) params.push("soloChef=true");
      if (keyword) params.push(`keyword=${encodeURIComponent(keyword)}`);
      if (params.length > 0) url += "?" + params.join("&");

      const res = await fetchWithAuth(url);
      if (res.ok) {
        const data = await res.json();
        setRicette(data);
      }
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  const fetchLikeUtente = async () => {
    if (!user) return;
    const res = await fetchWithAuth(`/Like/utente/${user.id}`);
    if (res.ok) {
      const data = await res.json();
      const ids = data.map((like) => like.creazioneId);
      setLikeUtente(ids);
    }
  };

  const toggleLike = async (creazioneId) => {
    const haLike = likeUtente.includes(creazioneId);
    const url = `/Like/${creazioneId}`;
    const method = haLike ? "DELETE" : "POST";

    const res = await fetchWithAuth(url, { method });
    if (res.ok) {
      await fetchLikeUtente();
      await fetchRicette();
    }
  };

  useEffect(() => {
    fetchRicette();
    if (isAuthenticated) {
      fetchLikeUtente();
    }
  }, [soloChef, keyword, isAuthenticated]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Ricettario</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Cerca ricetta..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="col-md-3 d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input me-2"
            id="soloChef"
            checked={soloChef}
            onChange={(e) => setSoloChef(e.target.checked)}
          />
          <label htmlFor="soloChef" className="form-check-label">
            Solo Chef
          </label>
        </div>
      </div>

      <div className="gronda-grid mt-4">
        {ricette.map((ricetta) => (
          <div key={ricetta.id} className="card-creazione">
            <div className="position-relative">
              <img
                src={`https://localhost:7081${ricetta.immagine}`}
                alt={ricetta.nome}
              />
              {ricetta.ruoloCreatore === "Chef" && (
                <div className="etichetta-pro">Chef</div>
              )}
            </div>
            <div className="card-creazione-body">
              <h5>{ricetta.nome}</h5>
              <p>{ricetta.autore}</p>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <Link
                  to={`/creazione/${ricetta.id}`}
                  className="btn btn-sm btn-outline-success"
                >
                  Dettagli
                </Link>
                {isAuthenticated && (
                  <button
                    className={`like-button ${likeUtente.includes(ricetta.id) ? "liked" : ""}`}
                    onClick={() => toggleLike(ricetta.id)}
                    title={
                      likeUtente.includes(ricetta.id)
                        ? "Rimuovi Like"
                        : "Metti Like"
                    }
                  >
                    {likeUtente.includes(ricetta.id) ? "❤️" : "🤍"} {ricetta.numeroLike}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ricettario;
