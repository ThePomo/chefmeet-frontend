import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";

const ModificaProfilo = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [immagine, setImmagine] = useState(null);
  const [messaggio, setMessaggio] = useState("");

  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setCognome(user.cognome);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Nome", nome);
    formData.append("Cognome", cognome);
    if (immagine) {
      formData.append("immagineProfilo", immagine);
    }

    try {
      const res = await fetchWithAuth(`/Utenti/${user.id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setMessaggio("Profilo aggiornato con successo!");
        setTimeout(() => navigate(`/utente/${user.id}`), 1500);
      } else {
        const errorData = await res.json();
        setMessaggio(errorData.errore || "Errore durante l'aggiornamento.");
      }
    } catch (error) {
      console.error("Errore:", error);
      setMessaggio("Errore durante l'invio.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3>Modifica Profilo</h3>
      {messaggio && <Alert variant="info">{messaggio}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nome" className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="cognome" className="mb-3">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="immagine" className="mb-3">
          <Form.Label>Immagine del profilo</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImmagine(e.target.files[0])}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Salva modifiche
        </Button>
      </Form>
    </Container>
  );
};

export default ModificaProfilo;
