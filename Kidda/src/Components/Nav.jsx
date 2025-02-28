import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Nav.css';
import LoginModal from './LoginModal';
import { jwtDecode } from 'jwt-decode';

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Estado del menú

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          handleLogout();
          return;
        }
        if (decoded.role === 'admin') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setMenuOpen(false); // Cierra el menú al abrir el login
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    setShowLoginModal(false);
    setMenuOpen(false); // Cierra el menú al hacer logout
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="Nav">
      <div className="navbar-logo">
        <a href="/">
          <img src="/KiddaLogo.png" alt="Kidda Logo" />
        </a>
      </div>

      {/* Ícono del menú hamburguesa */}
      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <Link to="/" onClick={closeMenu}>INICIO</Link>
        </li>
        <li>
          <Link to="/revistas" onClick={closeMenu}>REVISTAS</Link>
        </li>
        {isLoggedIn && (
          <li>
            <Link to="/admin" onClick={closeMenu}>PANEL</Link>
          </li>
        )}
        {!isLoggedIn ? (
          <li>
            <span onClick={handleLoginClick} className="login-link">LOGIN</span>
          </li>
        ) : (
          <li>
            <span onClick={handleLogout} className="login-link">LOGOUT</span>
          </li>
        )}
      </ul>

      {showLoginModal && (
        <LoginModal 
          setIsLoggedIn={setIsLoggedIn} 
          setToken={setToken} 
          closeLoginModal={closeLoginModal} 
        />
      )}
    </nav>
  );
}

export default Nav;
