// src/components/UserFormModal.jsx
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { fetchWithAuth } from "../utils/api";

const UserFormModal = ({ utente, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    cognome: "",
    email: "",
    ruolo: "Utente", // default
  });

  useEffect(() => {
    if (utente) {
      setFormData({
        id: utente.id, // ✅ importante per PUT
        nome: utente.nome,
        cognome: utente.cognome,
        email: utente.email,
        ruolo: utente.ruolo,
      });
    }
  }, [utente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = utente
        ? `/Admin/modifica-utente/${utente.id}`
        : "/Admin/crea-utente";

      const method = utente ? "PUT" : "POST";

      const { nome, cognome, email, ruolo } = formData;
      const id = utente?.id; 
      

      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nome, cognome, email, ruolo }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await res.json();
        console.error("Errore nella gestione utente:", error);
      }
    } catch (err) {
      console.error("Errore submit:", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="nome" className="mb-3">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="cognome" className="mb-3">
        <Form.Label>Cognome</Form.Label>
        <Form.Control
          type="text"
          name="cognome"
          value={formData.cognome}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="ruolo" className="mb-3">
        <Form.Label>Ruolo</Form.Label>
        <Form.Select
          name="ruolo"
          value={formData.ruolo}
          onChange={handleChange}
          required
        >
          <option value="Utente">Utente</option>
          <option value="Chef">Chef</option>
          <option value="Admin">Admin</option>
        </Form.Select>
      </Form.Group>

      <Button variant="success" type="submit">
        {utente ? "Salva Modifiche" : "Crea Utente"}
      </Button>
    </Form>
  );
};

export default UserFormModal;
