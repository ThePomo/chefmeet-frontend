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
import AdminDashboard from "./views/AdminDashboard";
import AdminRoute from "./utils/AdminRoute";
import PrivateRoute from "./utils/PrivateRoute";
import EventoDettaglio from "./views/EventoDettaglio";
import ModificaEvento from "./views/ModificaEvento";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterComponent from "./components/FooterComponent";





const App = () => {
  return (
    <Router>
      <NavbarComponent />
      
       {/* ✅ Contenitore toast */}
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ HOME pubblica dinamica */}
          <Route path="/" element={<Home />} />

          {/* ROTTE PRIVATE */}
          <Route path="/eventi" element={<PrivateRoute><Eventi /></PrivateRoute>} />
          <Route path="/creazioni" element={<PrivateRoute><Creazioni /></PrivateRoute>} />
          <Route path="/prenotazioni" element={<PrivateRoute><Prenotazioni /></PrivateRoute>} />
          <Route path="/ricettario" element={<PrivateRoute><Ricettario /></PrivateRoute>} />
          <Route path="/ChefProfile" element={<PrivateRoute><ChefProfile /></PrivateRoute>} />
          <Route path="/ModificaChefProfile" element={<PrivateRoute><ModificaChefProfile /></PrivateRoute>} />
          <Route path="/crea-evento" element={<PrivateRoute><CreaEvento /></PrivateRoute>} />
          <Route path="/miei-eventi" element={<PrivateRoute><MieiEventi /></PrivateRoute>} />
          <Route path="/chef/:id" element={<PrivateRoute><ChefPublicProfile /></PrivateRoute>} />
          <Route path="/utente/:id" element={<PrivateRoute><UserPublicProfile /></PrivateRoute>} />
          <Route path="/creazione/:id" element={<PrivateRoute><CreazioneDettaglio /></PrivateRoute>} />
          <Route path="/crea-ricetta" element={<PrivateRoute><CreaCreazione /></PrivateRoute>} />
          <Route path="/modifica-creazione/:id" element={<PrivateRoute><ModificaCreazione /></PrivateRoute>} />
          <Route path="/modifica-ricetta/:id" element={<PrivateRoute><ModificaCreazione /></PrivateRoute>} />
          <Route path="/modifica-profilo" element={<PrivateRoute><ModificaProfilo /></PrivateRoute>} />
          <Route path="/profilo" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/mie-prenotazioni" element={<PrivateRoute><MiePrenotazioni /></PrivateRoute>} />
          <Route path="/prenotazioni-ricevute" element={<PrivateRoute><PrenotazioniRicevute /></PrivateRoute>} />
          <Route path="/evento/:id" element={<EventoDettaglio />} />
          <Route path="/evento/modifica/:id" element={<ModificaEvento />} />
      



          {/* ROTTA ADMIN */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>
      <FooterComponent />
    </Router>
  );
};

export default App;
