import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const ModificaEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titolo: "",
    descrizione: "",
    data: "",
    prezzo: 0,
    immagine: "",
    chefNome: "",
    chefUserId: "",
    chefId: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const caricaEvento = async () => {
      try {
        const res = await fetchWithAuth(`/Evento/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            titolo: data.titolo,
            descrizione: data.descrizione,
            data: data.data.split("T")[0],
            prezzo: data.prezzo,
            immagine: data.immagine,
            chefNome: data.chefNome,
            chefUserId: data.chefUserId,
            chefId: data.chefId,
          });
        } else {
          console.error("Errore nel caricamento dell'evento");
        }
      } catch (err) {
        console.error("Errore di rete:", err);
      } finally {
        setLoading(false);
      }
    };

    caricaEvento();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventoAggiornato = {
      id: parseInt(id),
      titolo: formData.titolo,
      descrizione: formData.descrizione,
      data: `${formData.data}T00:00:00`,
      prezzo: parseFloat(formData.prezzo),
      immagine: formData.immagine || "",
      chefNome: formData.chefNome || "",
      chefUserId: formData.chefUserId || "",
      chefId: formData.chefId || 0,
    };

    try {
      const res = await fetchWithAuth(`/Evento/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventoAggiornato),
      });

      if (res.ok) {
        toast.success("Evento modificato con successo!");
        navigate("/miei-eventi");
      } else {
        toast.error("Errore durante la modifica dell'evento.");
        console.error("Errore durante la modifica");
      }
    } catch (err) {
      toast.error("Errore di rete");
      console.error("Errore submit:", err);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="container mt-4">
      <h2>Modifica Evento</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            name="titolo"
            value={formData.titolo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descrizione</Form.Label>
          <Form.Control
            as="textarea"
            name="descrizione"
            rows={4}
            value={formData.descrizione}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Data</Form.Label>
          <Form.Control
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Prezzo</Form.Label>
          <Form.Control
            type="number"
            name="prezzo"
            value={formData.prezzo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Salva modifiche
        </Button>
      </Form>
    </div>
  );
};

export default ModificaEvento;
