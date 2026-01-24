import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo-text">EL TUZER</div>
          <div className="footer-subtitle">СТУДИЯ МЕБЕЛИ & САЛОНА</div>
        </div>
        <div className="footer-info">
          <div>Казахстан, г. Атырау</div>
          <div>Адрес: Канцева 1</div>
          <a href="tel:+77022199966" className="footer-link">
            +7 702 219 9966
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


