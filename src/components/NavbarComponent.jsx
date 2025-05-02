import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Form, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { fetchWithAuth } from "../utils/api";
import logo from "../assets/img/scrittacheefmeet.png";

const NavbarComponent = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [risultati, setRisultati] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setRisultati([]);
      return;
    }

    try {
      const res = await fetchWithAuth(`/Utenti/ricerca?nome=${value}`);
      if (res.ok) {
        const utenti = await res.json();
        setRisultati(utenti);
      } else {
        setRisultati([]);
      }
    } catch (err) {
      console.error("Errore nella ricerca:", err);
      setRisultati([]);
    }
  };

  const handleNavigateToProfilo = (utente) => {
    if (utente.ruolo === "Chef" && utente.chefId) {
      navigate(`/chef/${utente.id}`);
    } else {
      navigate(`/utente/${utente.id}`);
    }
    setSearchTerm("");
    setRisultati([]);
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#04ABA2" }} variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" className="align-middle" style={{ height: "40px", marginTop: "5px" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            )}

            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/eventi">Eventi</Nav.Link>
                <Nav.Link as={Link} to="/ricettario">Ricettario</Nav.Link>
              </>
            )}

            {isAuthenticated && user?.ruolo === "Chef" && (
              <>
                <Nav.Link as={Link} to="/ChefProfile">Profilo</Nav.Link>
                <Nav.Link as={Link} to="/miei-eventi">I miei eventi</Nav.Link>
                <Nav.Link as={Link} to="/crea-evento">Crea Evento</Nav.Link>
                <Nav.Link as={Link} to="/prenotazioni-ricevute">Prenotazioni ricevute</Nav.Link>
              </>
            )}

            {isAuthenticated && user?.ruolo === "Utente" && (
              <>
                <Nav.Link as={Link} to={`/utente/${user.id}`}>Profilo</Nav.Link>
                <Nav.Link as={Link} to="/mie-prenotazioni">Le mie prenotazioni</Nav.Link>
              </>
            )}

            {isAuthenticated && user?.ruolo === "Admin" && (
              <>
                <Nav.Link as={Link} to="/admin">Dashboard Admin</Nav.Link>
              </>
            )}

            {isAuthenticated && user?.ruolo !== "Admin" && (
              <Nav.Link as={Link} to="/crea-ricetta">Crea Ricetta</Nav.Link>
            )}
          </Nav>

          {isAuthenticated && (
            <Form className="d-flex me-2 position-relative">
              <Form.Control
                type="search"
                placeholder="Cerca utenti o chef"
                className="me-2"
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              {risultati.length > 0 && (
                <ListGroup className="position-absolute w-100" style={{ top: "100%", zIndex: 999 }}>
                  {risultati.map((utente) => (
                    <ListGroup.Item
                      key={utente.id}
                      action
                      onClick={() => handleNavigateToProfilo(utente)}
                      className="d-flex align-items-center"
                    >
                      {utente.immagineProfilo && (
                        <img
                          src={`https://localhost:7081${utente.immagineProfilo}`}
                          alt="profilo"
                          style={{
                            width: "28px",
                            height: "28px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: "10px"
                          }}
                        />
                      )}
                      <span>{utente.nome} {utente.cognome}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form>
          )}

          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrati</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
