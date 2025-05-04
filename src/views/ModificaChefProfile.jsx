import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/api";
import { useNavigate } from "react-router-dom";

const ModificaChefProfile = () => {
  const user = useSelector((state) => state.user.user);
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    bio: "",
    città: ""
  });

  const [immagineFile, setImmagineFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const res = await fetchWithAuth(`/Chef/byUser/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            id: data.id,
            nome: data.nome,
            cognome: data.cognome,
            email: data.email,
            bio: data.bio,
            città: data.città
          });
          if (data.immagineProfilo) {
            setPreview(`https://localhost:7081${data.immagineProfilo}`);
          }
        }
      } catch (err) {
        console.error("Errore nel caricamento del profilo:", err);
      }
    };

    if (user?.id) fetchChef();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImmagineFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("nome", form.nome);
    formData.append("cognome", form.cognome);
    formData.append("bio", form.bio);
    formData.append("città", form.città);
    if (immagineFile) {
      formData.append("immagineProfilo", immagineFile);
    }

    try {
      const res = await fetchWithAuth(`/Chef/${form.id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        alert("Profilo aggiornato con successo.");
        navigate("/ChefProfile");
      } else {
        const errText = await res.text();
        alert("Errore: " + errText);
      }
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Modifica Profilo Chef</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cognome</label>
          <input
            name="cognome"
            value={form.cognome}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            value={form.email}
            disabled
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Biografia</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="form-control"
            rows={4}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Città</label>
          <input
            name="città"
            value={form.città}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Immagine Profilo</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="mb-3 text-center">
            <img
              src={preview}
              alt="Anteprima"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "250px" }}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Salva modifiche
        </button>
      </form>
    </div>
  );
};

export default ModificaChefProfile;
