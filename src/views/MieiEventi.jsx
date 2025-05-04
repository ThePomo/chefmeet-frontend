import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MieiEventi = () => {
  const [eventi, setEventi] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const caricaEventi = async () => {
      try {
        const res = await fetchWithAuth("/Evento/miei-eventi");
        if (res.ok) {
          const data = await res.json();
          setEventi(data);
        } else {
          console.error("Errore nel caricamento degli eventi");
        }
      } catch (err) {
        console.error("Errore di rete:", err);
      }
    };

    caricaEventi();
  }, []);

  const handleElimina = async (id) => {
    const conferma = window.confirm("Sei sicuro di voler eliminare questo evento?");
    if (!conferma) return;

    try {
      const res = await fetchWithAuth(`/Evento/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Evento eliminato con successo.");
        setEventi((prev) => prev.filter((e) => e.id !== id));
      } else {
        toast.error("Errore durante l'eliminazione dell'evento.");
      }
    } catch (err) {
      toast.error("Errore di rete durante l'eliminazione.");
      console.error("Errore:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">I Miei Eventi</h2>
      <div className="row">
        {eventi.map((evento) => (
          <div className="col-md-6 mb-4" key={evento.id}>
            <div className="card h-100 shadow">
              {evento.immagine && (
                <img
                  src={`https://localhost:7081${evento.immagine}`}
                  className="card-img-top"
                  alt="evento"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{evento.titolo}</h5>
                <p className="card-text">{evento.descrizione}</p>
                <p>
                  <strong>Data:</strong> {new Date(evento.data).toLocaleDateString()}
                </p>
                <p>
                  <strong>Prezzo:</strong> €{evento.prezzo}
                </p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-info"
                    onClick={() => navigate(`/evento/${evento.id}`)}
                  >
                    Dettagli
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate(`/evento/modifica/${evento.id}`)}
                  >
                    Modifica
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleElimina(evento.id)}
                  >
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MieiEventi;
