import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            {!logoError ? (
              <img
                src="/logo-eltuzer.png"
                alt="EL TUZER — студия мебели и салона"
                className="logo-image"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="logo-fallback">
                <span className="logo-text">EL TUZER</span>
                <span className="logo-subtitle">СТУДИЯ МЕБЕЛИ & САЛОНА</span>
              </div>
            )}
          </Link>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Главная
            </Link>
            <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Каталог
            </Link>
            {isAuthenticated && (
              <Link to="/manage" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Управление
              </Link>
            )}
            {!isAuthenticated ? (
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Вход
              </Link>
            ) : (
              <button className="nav-link btn-logout" onClick={handleLogout}>
                Выход
              </button>
            )}
          </nav>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

