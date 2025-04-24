import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./app.css";
import NavbarComponent from "./components/NavbarComponent";
import Home from "./views/Home";
import Login from "./views/login";
import Register from "./views/Register";
import Eventi from "./views/Eventi";
import Creazioni from "./views/Creazioni";
import Prenotazioni from "./views/Prenotazioni";
import Ricettario from "./views/Ricettario";
import ChefProfile from "./views/ChefProfile";
import ModificaChefProfile from "./views/ModificaChefProfile";
import CreaEvento from "./views/CreaEvento";
import MieiEventi from "./views/MieiEventi";
import ChefPublicProfile from "./views/ChefPublicProfile";
import UserPublicProfile from "./views/UserPublicProfile";
import CreazioneDettaglio from "./views/CreazioneDettaglio";
import CreaCreazione from "./views/CreaCreazione";
import ModificaCreazione from "./views/ModificaCreazione";
import ModificaProfilo from "./views/ModificaProfilo";
import UserProfile from "./views/UserProfile";
import MiePrenotazioni from "./views/MiePrenotazioni";
import PrenotazioniRicevute from "./views/PrenotazioniRicevute";

const App = () => {
  return (
    <Router>
      <NavbarComponent />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/eventi" element={<Eventi />} />
          <Route path="/creazioni" element={<Creazioni />} />
          <Route path="/prenotazioni" element={<Prenotazioni />} />
          <Route path="/ricettario" element={<Ricettario />} />
          <Route path="/ChefProfile" element={<ChefProfile />} />
          <Route
            path="/ModificaChefProfile"
            element={<ModificaChefProfile />}
          />
          <Route path="/crea-evento" element={<CreaEvento />} />
          <Route path="/miei-eventi" element={<MieiEventi />} />
          <Route path="/chef/:id" element={<ChefPublicProfile />} />
          <Route path="/utente/:id" element={<UserPublicProfile />} />
          <Route path="/creazione/:id" element={<CreazioneDettaglio />} />
          <Route path="/crea-ricetta" element={<CreaCreazione />} />
          <Route
            path="/modifica-creazione/:id"
            element={<ModificaCreazione />}
          />
          <Route path="/modifica-ricetta/:id" element={<ModificaCreazione />} />
          <Route path="/modifica-profilo" element={<ModificaProfilo />} />
          <Route path="/profilo" element={<UserProfile />} />
          <Route path="/mie-prenotazioni" element={<MiePrenotazioni />} />
          <Route
            path="/prenotazioni-ricevute"
            element={<PrenotazioniRicevute />}
          />

  
        </Routes>
      </div>
    </Router>
  );
};

export default App;
