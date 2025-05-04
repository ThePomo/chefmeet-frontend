import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import { Card, Container, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const CreazioneDettaglio = () => {
  const { id } = useParams();
  const [creazione, setCreazione] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchCreazione = async () => {
    try {
      const res = await fetchWithAuth(`/Creazione/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCreazione(data);
      } else {
        console.error("Errore nel caricamento della ricetta");
      }
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  const handleDelete = async () => {
    const conferma = window.confirm(
      "Sei sicuro di voler eliminare questa ricetta?"
    );
    if (!conferma) return;

    try {
      const res = await fetchWithAuth("/Creazione", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: creazione.id }),
      });

      if (res.ok) {
        alert("Ricetta eliminata con successo.");
        navigate("/ricettario");
      } else {
        alert("Errore durante l'eliminazione.");
      }
    } catch (err) {
      console.error("Errore:", err);
    }
  };

  useEffect(() => {
    fetchCreazione();
  }, [id]);

  if (!creazione) return <Container className="mt-5">Caricamento...</Container>;

  const èAutore = user?.nome + " " + user?.cognome === creazione.autore;

  return (
    <Container className="mt-5" style={{ maxWidth: "800px" }}>
      <Card className="shadow">
        <Card.Img
          variant="top"
          src={`https://localhost:7081${creazione.immagine}`}
          style={{ objectFit: "cover", maxHeight: "400px" }}
        />
        <Card.Body>
          <Card.Title>{creazione.nome}</Card.Title>
          <Card.Text>
            <strong>Autore:</strong>{" "}
            <Link
              to={
                creazione.isChef && creazione.chefId
                  ? `/chef/${creazione.chefId}`
                  : `/utente/${creazione.creatoreId}`
              }
              className="text-decoration-none"
            >
              {creazione.autore}
            </Link>
          </Card.Text>
          <Card.Text style={{ whiteSpace: "pre-line" }}>
            {creazione.descrizione}
          </Card.Text>
          <Card.Text>
            <strong>❤️ Like:</strong> {creazione.numeroLike}
          </Card.Text>

          {èAutore && (
            <div className="d-flex gap-2 mt-3">
              <Button
                variant="warning"
                onClick={() => navigate(`/modifica-ricetta/${creazione.id}`)}
              >
                Modifica
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Elimina
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreazioneDettaglio;
