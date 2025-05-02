import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CalendarioDisponibilita from "../components/CalendarioDisponibilita";
import PrenotaDisponibilita from "../components/PrenotaDisponibilita";

const ChefProfile = () => {
  const [chef, setChef] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const userId = id || user.id;
        const res = await fetchWithAuth(`/Chef/byUser/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setChef(data);
          setIsOwnProfile(userId === user.id);
        } else {
          console.error("Errore nel caricamento del profilo");
        }
      } catch (err) {
        console.error("Errore di rete:", err);
      }
    };

    if (user?.id) {
      fetchChef();
    }
  }, [user, id]);

  if (!chef) return <div className="container mt-5">Caricamento profilo...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <div className="profile-box d-flex align-items-start mb-4">
        {chef.immagineProfilo && (
          <img
            src={`https://localhost:7081${chef.immagineProfilo}`}
            alt="Immagine profilo"
            className="profile-image-round me-4"
          />
        )}
        <div className="profile-info">
          <h4>{chef.nome} {chef.cognome}</h4>
          <p><strong>Email:</strong> {chef.email}</p>
          <p><strong>Biografia:</strong> {chef.bio}</p>
          {chef.città && <p><strong>Città:</strong> {chef.città}</p>}

          {isOwnProfile && (
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-warning" onClick={() => navigate("/ModificaChefProfile")}>
                ✏️ Modifica Profilo
              </button>
              <button className="btn btn-success" onClick={() => navigate("/crea-evento")}>
                ➕ Crea Evento
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h5>Disponibilità Eventi</h5>
        {isOwnProfile ? (
          <CalendarioDisponibilita />
        ) : (
          <PrenotaDisponibilita chefUserId={chef.id} />
        )}
      </div>
    </div>
  );
};

export default ChefProfile;
