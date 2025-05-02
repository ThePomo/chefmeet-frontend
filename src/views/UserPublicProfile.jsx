import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import ListaCreazioniUtente from "../components/ListaCreazioniUtente";
import { useSelector } from "react-redux";

const UserPublicProfile = () => {
  const { id } = useParams();
  const [utente, setUtente] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUtente = async () => {
      try {
        const res = await fetchWithAuth(`/Utenti/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUtente(data);
        } else {
          console.error("Utente non trovato");
        }
      } catch (err) {
        console.error("Errore:", err);
      }
    };

    fetchUtente();
  }, [id]);

  if (!utente) return <div className="container mt-5">Caricamento profilo...</div>;

  const isOwner = user?.id === utente.id;

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h3 className="mb-4">Profilo Utente</h3>

      <div className="profile-box d-flex align-items-start mb-4">
        {utente.immagineProfilo && (
          <img
            src={`https://localhost:7081${utente.immagineProfilo}`}
            alt="Profilo utente"
            className="profile-image-round me-4"
          />
        )}
        <div className="profile-info">
          <h5>{utente.nome} {utente.cognome}</h5>
          <p><strong>Email:</strong> {utente.email}</p>
          <p><strong>Ruolo:</strong> {utente.ruolo}</p>
          {isOwner && (
            <button className="btn btn-warning mt-2" onClick={() => navigate("/profilo")}>
              ✏️ Modifica Profilo
            </button>
          )}
        </div>
      </div>

      <h4 className="mb-3">Ricette create da {utente.nome}:</h4>
      <ListaCreazioniUtente userId={utente.id} />
    </div>
  );
};

export default UserPublicProfile;
