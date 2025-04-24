// src/views/Ricettario.jsx
import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
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
      <h2>Ricettario</h2>

      <Form className="my-3">
        <Row className="align-items-center">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Cerca ricetta..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Check
              type="checkbox"
              label="Solo Chef"
              checked={soloChef}
              onChange={(e) => setSoloChef(e.target.checked)}
            />
          </Col>
        </Row>
      </Form>

      <Row xs={1} md={2} lg={3} className="g-4">
        {ricette.map((ricetta) => (
          <Col key={ricetta.id}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={`https://localhost:7081${ricetta.immagine}`}
                style={{ objectFit: "cover", height: "200px" }}
              />
              <Card.Body>
                <Card.Title>{ricetta.nome}</Card.Title>
                <Card.Text>{ricetta.descrizione.slice(0, 100)}...</Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Di {ricetta.autore}</small>
                  <br />
                  <Link
                    to={`/creazione/${ricetta.id}`}
                    className="btn btn-sm btn-outline-primary mt-2"
                  >
                    Dettagli
                  </Link>
                </div>

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
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Ricettario;
