import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import { Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const EventoDettaglio = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const caricaEvento = async () => {
      try {
        const res = await fetchWithAuth(`/Evento/${id}`);
        if (res.ok) {
          const data = await res.json();
        
          setEvento(data);
        } else {
          console.error("Errore nel caricamento dell'evento");
        }
      } catch (error) {
        console.error("Errore fetch:", error);
      } finally {
        setLoading(false);
      }
    };
  
    caricaEvento();
  }, [id]);
  

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (!evento) {
    return <p>Evento non trovato</p>;
  }

  return (
    <Card className="m-4 p-4 shadow">
      <Card.Img
  variant="top"
  src={`https://localhost:7081${evento.immagine}`}
  alt="Evento"
  className="rounded mb-3"
/>

      <Card.Body>
        <Card.Title className="fs-3">{evento.nomeEvento}</Card.Title>
        <Card.Text>{evento.descrizione}</Card.Text>
        <p><strong>Data:</strong> {new Date(evento.data).toLocaleDateString()}</p>
        <p><strong>Prezzo:</strong> €{evento.prezzo}</p>
        <p>
  <strong>Chef:</strong>{" "}
  <Link to={`/chef/${evento.chefUserId}`} className="text-decoration-none text-success">
    {evento.chefNome}
  </Link>
</p>
      </Card.Body>
    </Card>
  );
};

export default EventoDettaglio;
