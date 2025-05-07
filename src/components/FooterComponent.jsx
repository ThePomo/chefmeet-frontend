import React from "react";

const FooterComponent = () => {
  return (
    <footer className="footer-dark mt-5">
      <div className="container text-center text-md-start pb-3">
        <div className="row">
          {/* Contatti */}
          <div className="col-md-4 mb-4">
            <h5>ChefMeet</h5>
            <p>
              Via del Gusto, 123<br />
              00100 Roma, Italia<br />
              Email: info@chefmeet.com<br />
              Tel: +39 0123 456789
            </p>
          </div>

          {/* Social */}
          <div className="col-md-4 mb-4 text-center">
            <h5>Seguici su</h5>
            <div className="d-flex justify-content-center gap-3 fs-4 mt-2">
              <a href="https://www.facebook.com/pomo.giuseppe/?locale=it_IT" target="_blank" rel="noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/giuseppe_pomo/?hl=it" target="_blank" rel="noreferrer">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/in/giuseppe-pomo-11a869333/?originalSubdomain=it" target="_blank" rel="noreferrer">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://github.com/ThePomo" target="_blank" rel="noreferrer">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>

          {/* Info e credits */}
          <div className="col-md-4 mb-4 text-md-end text-center">
            <h5>Informazioni</h5>
            <p className="mb-1">&copy; {new Date().getFullYear()} ChefMeet</p>
            <p>Created by <strong>Giuseppe Pomo</strong></p>
          </div>
        </div>
      </div>

      <div className="text-center py-2 border-top border-secondary small">
        Tutti i diritti riservati • ChefMeet
      </div>
    </footer>
  );
};

export default FooterComponent;
