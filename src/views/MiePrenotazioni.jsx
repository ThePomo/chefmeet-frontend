import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";
import { useSelector } from "react-redux";
import { Card, Button } from "react-bootstrap";

const MiePrenotazioni = () => {
  const user = useSelector((state) => state.user.user);
  const [prenotazioni, setPrenotazioni] = useState([]);

  const fetchPrenotazioni = async () => {
    const res = await fetchWithAuth(`/Prenotazione/utente/${user.id}`);
    if (res.ok) {
      const data = await res.json();
      setPrenotazioni(data);
    }
  };

  useEffect(() => {
    if (user?.id) fetchPrenotazioni();
  }, [user]);

  const handleCancella = async (idPrenotazione) => {
    const conferma = window.confirm("Sei sicuro di voler cancellare la prenotazione?");
    if (!conferma) return;

    const res = await fetchWithAuth(`/Prenotazione/${idPrenotazione}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Prenotazione cancellata.");
      setPrenotazioni((prev) => prev.filter((p) => p.id !== idPrenotazione));
    } else {
      alert("Errore nella cancellazione.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Le mie prenotazioni</h3>

      {prenotazioni.length === 0 ? (
        <p>Nessuna prenotazione effettuata.</p>
      ) : (
        <div className="row">
          {prenotazioni.map((p) => (
            <div className="col-md-6 mb-4" key={p.id}>
              <Card className="p-3 border-0 shadow-sm rounded-4 h-100">
                <Card.Body>
                  <Card.Title className="mb-2">{p.eventoTitolo}</Card.Title>
                  <Card.Text className="mb-1">
                    <strong>Data:</strong> {new Date(p.dataPrenotazione).toLocaleDateString()}
                  </Card.Text>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancella(p.id)}
                  >
                    Cancella
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MiePrenotazioni;
