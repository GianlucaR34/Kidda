import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/nav.css';
import LoginModal from './LoginModal';
import { jwtDecode } from 'jwt-decode';

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token')); // Obtener token de localStorage
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    console.log('Token from localStorage:', token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded);

        // Verificar si el token ha expirado
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          console.log("El token ha expirado, cerrando sesión...");
          handleLogout();
          return;
        }

        if (decoded.role === 'admin') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        handleLogout();
      }
    } else {
      console.log('No token found in localStorage');
      setIsLoggedIn(false);
    }
  }, [token]);

  // Detectar cambios en localStorage (por si se cambia en otra pestaña)
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
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    setShowLoginModal(false); // ✅ Asegurar que el modal se cierra al hacer logout
    console.log("Sesión cerrada correctamente");
  };

  return (
    <nav className="Nav">
      <div className="navbar-logo">
        <a href="/">
          <img src="/KiddaLogo.png" alt="Kidda Logo" />
        </a>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">INICIO</Link>
        </li>
        <li>
          <Link to="/revistas">REVISTAS</Link>
        </li>
        {isLoggedIn && (
          <li>
            <Link to="/admin">PANEL</Link>
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
