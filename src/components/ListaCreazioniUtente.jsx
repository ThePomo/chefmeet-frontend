// src/components/ListaCreazioniUtente.jsx
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ListaCreazioniUtente = ({ userId }) => {
  const [creazioni, setCreazioni] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const isProprietario = user?.id === userId;

  useEffect(() => {
    const fetchCreazioni = async () => {
      const res = await fetchWithAuth(`/Creazione/byUser/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCreazioni(data);
      }
    };
    fetchCreazioni();
  }, [userId]);

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa ricetta?")) {
      const res = await fetchWithAuth("/Creazione", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setCreazioni(creazioni.filter((c) => c.id !== id));
      } else {
        alert("Errore durante l'eliminazione.");
      }
    }
  };

  if (creazioni.length === 0) return <p>Nessuna ricetta creata.</p>;

  return (
    <Row xs={1} md={2} lg={3} className="g-4 mt-3">
      {creazioni.map((creazione) => (
        <Col key={creazione.id}>
          <Card className="h-100 shadow-sm">
            <Card.Img
              variant="top"
              src={`https://localhost:7081${creazione.immagine}`}
              style={{ objectFit: "cover", height: "200px" }}
            />
            <Card.Body>
              <Card.Title>{creazione.nome}</Card.Title>
              <Card.Text>{creazione.descrizione.slice(0, 100)}...</Card.Text>
              <Link
                to={`/creazione/${creazione.id}`}
                className="btn btn-sm btn-outline-primary me-2"
              >
                Vai alla Ricetta
              </Link>
              {isProprietario && (
                <>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2 mt-2"
                    onClick={() => navigate(`/modifica-ricetta/${creazione.id}`)}
                  >
                    Modifica
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleDelete(creazione.id)}
                  >
                    Elimina
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ListaCreazioniUtente;
