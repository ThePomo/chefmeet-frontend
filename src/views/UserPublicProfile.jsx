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
    <div className="container mt-5">
      <h2>Profilo Pubblico</h2>
      <div className="card p-4 shadow mb-4">
        <h4>{utente.nome} {utente.cognome}</h4>
        <p><strong>Email:</strong> {utente.email}</p>
        {utente.immagineProfilo && (
          <img
            src={`https://localhost:7081${utente.immagineProfilo}`}
            alt="Profilo utente"
            style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%" }}
          />
        )}

        {/* ✅ Bottone visibile solo se è il profilo dell'utente loggato */}
        {isOwner && (
          <button
            className="btn btn-warning mt-3"
            onClick={() => navigate("/profilo")}
          >
            ✏️ Modifica Profilo
          </button>
        )}
      </div>

      {/* 🔥 Sezione ricette create */}
      <h4>Ricette create da {utente.nome}:</h4>
      <ListaCreazioniUtente userId={utente.id} />
    </div>
  );
};

export default UserPublicProfile;
