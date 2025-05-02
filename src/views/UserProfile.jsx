import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/api";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [form, setForm] = useState({
    nome: user?.nome || "",
    cognome: user?.cognome || "",
  });
  const [immagine, setImmagine] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profilo, setProfilo] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImmagine(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchProfilo = async () => {
    const res = await fetchWithAuth(`/Utenti/${user.id}`);
    if (res.ok) {
      const data = await res.json();
      setProfilo(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", form.nome);
    formData.append("cognome", form.cognome);
    if (immagine) formData.append("immagineProfilo", immagine);

    const res = await fetchWithAuth(`/Utenti/${user.id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      alert("Profilo aggiornato con successo.");
      navigate(`/utente/${user.id}`);
    } else {
      alert("Errore durante l'aggiornamento del profilo.");
    }
  };

  useEffect(() => {
    fetchProfilo();
  }, []);

  return (
    <Container className="mt-4" style={{ maxWidth: "700px" }}>
      <h3 className="mb-4">Profilo Utente</h3>

      {profilo && (
        <div className="profile-box d-flex align-items-start mb-4">
          <img
            src={preview ? preview : `https://localhost:7081${profilo.immagineProfilo}`}
            alt="Profilo"
            className="profile-image-round me-4"
          />
          <div className="profile-info">
            <h5>{profilo.nome} {profilo.cognome}</h5>
            <p><strong>Email:</strong> {profilo.email}</p>
            <p><strong>Ruolo:</strong> {profilo.ruolo}</p>
          </div>
        </div>
      )}

      <h5 className="mb-3">Modifica dati</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            name="cognome"
            value={form.cognome}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nuova immagine profilo</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Salva modifiche
        </Button>
      </Form>
    </Container>
  );
};

export default UserProfile;

