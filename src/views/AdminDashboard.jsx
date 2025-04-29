// src/views/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Button, Table, Modal } from "react-bootstrap";
import UserFormModal from "../components/UserFormModal";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [utenti, setUtenti] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [utenteSelezionato, setUtenteSelezionato] = useState(null);

  useEffect(() => {
    if (!user || user.ruolo !== "Admin") {
      navigate("/");
    } else {
      caricaUtenti();
    }
  }, []);

  const caricaUtenti = async () => {
    const res = await fetchWithAuth("/Admin/utenti");
    if (res.ok) {
      const data = await res.json();
      setUtenti(data);
    }
  };

  const handleElimina = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo utente?")) {
      const res = await fetchWithAuth(`/Admin/elimina-utente/${id}`, {
        method: "DELETE",
      });
      if (res.ok) caricaUtenti();
    }
  };

  const handleModifica = (utente) => {
    setUtenteSelezionato(utente);
    setShowModal(true);
  };

  const handleNuovo = () => {
    setUtenteSelezionato(null);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">👑 Pannello Amministratore</h2>
      <Button variant="primary" className="mb-3" onClick={handleNuovo}>
        ➕ Crea Nuovo Utente
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Email</th>
            <th>Ruolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {utenti.map((u) => (
            <tr key={u.id}>
              <td>{u.nome}</td>
              <td>{u.cognome}</td>
              <td>{u.email}</td>
              <td>{u.ruolo}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleModifica(u)}
                >
                  ✏️ Modifica
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleElimina(u.id)}
                >
                  🗑️ Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal per modifica o creazione utente */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {utenteSelezionato ? "Modifica Utente" : "Crea Nuovo Utente"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserFormModal
            utente={utenteSelezionato}
            onClose={() => setShowModal(false)}
            onSuccess={caricaUtenti}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
