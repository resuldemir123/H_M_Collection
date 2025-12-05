import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <span className="me-2">&copy; 2025 - H_M_Collection</span>
            <Link to="/about" className="footer-link">Hakkımızda</Link>
            <Link to="/satisfaction" className="footer-link">Müşteri Memnuniyeti</Link>
            <Link to="/contact" className="footer-link">İletişim</Link>
          </div>
          <div className="text-light-50 small">
            Bootstrap ile tasarlandı
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

