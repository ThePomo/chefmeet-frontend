import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import ListaCreazioniUtente from "../components/ListaCreazioniUtente";

const ChefPublicProfile = () => {
  const { id } = useParams(); 
  const [chef, setChef] = useState(null);

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const res = await fetchWithAuth(`/Chef/${id}`);
        if (res.ok) {
          const data = await res.json();
          setChef(data);
        } else {
          console.error("Errore nel caricamento del profilo pubblico");
        }
      } catch (err) {
        console.error("Errore di rete:", err);
      }
    };

    fetchChef();
  }, [id]);

  if (!chef) return <div className="container mt-5">Caricamento profilo...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <div className="card p-4 shadow">
        <h2 className="mb-3">
          {chef.nome} {chef.cognome}
        </h2>
        <p>
          <strong>Email:</strong> {chef.email}
        </p>
        <p>
          <strong>Biografia:</strong> {chef.bio}
        </p>
        {chef.città && (
          <p>
            <strong>Città:</strong> {chef.città}
          </p>
        )}
        {chef.immagineProfilo && (
          <img
            src={`https://localhost:7081${chef.immagineProfilo}`}
            alt="Profilo chef"
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "250px" }}
          />
        )}
      </div>

      {/* 🔥 Sezione ricette */}
      <ListaCreazioniUtente userId={chef.userId} />
    </div>
  );
};

export default ChefPublicProfile;
