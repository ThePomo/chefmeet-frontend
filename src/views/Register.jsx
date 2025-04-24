import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    ruolo: "Utente",
    bio: "",
    citta: "",
  });
  const [immagineFile, setImmagineFile] = useState(null);
  const [errore, setErrore] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImmagineFile(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (immagineFile) {
      formData.append("immagineProfilo", immagineFile);
    }

    try {
      const response = await fetch("https://localhost:7081/api/Auth/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Registrazione completata! Ora puoi accedere.");
        navigate("/login");
      } else {
        const data = await response.json();
        setErrore(data.errore || "Errore durante la registrazione.");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      setErrore("Errore di rete: " + error.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Registrati</h2>
      <form onSubmit={handleRegister} encType="multipart/form-data">
        <div className="mb-3">
          <label>Nome</label>
          <input name="nome" className="form-control" value={form.nome} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Cognome</label>
          <input name="cognome" className="form-control" value={form.cognome} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Ruolo</label>
          <select name="ruolo" className="form-select" value={form.ruolo} onChange={handleChange}>
            <option value="Utente">Utente</option>
            <option value="Chef">Chef</option>
          </select>
        </div>

        {form.ruolo === "Chef" && (
          <>
            <div className="mb-3">
              <label>Biografia</label>
              <textarea name="bio" className="form-control" value={form.bio} onChange={handleChange} rows={3} />
            </div>
            <div className="mb-3">
              <label>Città</label>
              <input name="citta" className="form-control" value={form.città} onChange={handleChange} />
            </div>
          </>
        )}

        <div className="mb-3">
          <label>Immagine Profilo</label>
          <input type="file" name="immagineProfilo" className="form-control" onChange={handleFileChange} />
        </div>

        {errore && <div className="text-danger mb-3">{errore}</div>}

        <button type="submit" className="btn btn-success w-100">Registrati</button>
      </form>
    </div>
  );
};

export default Register;
