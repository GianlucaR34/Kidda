import React, { useState, useEffect } from 'react';
import '../Styles/LoginModal.css';

const LoginModal = ({ setIsLoggedIn, setToken, closeLoginModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLoginModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeLoginModal]);

  // Función para manejar el login
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      setToken(data.token);
      setIsLoggedIn(true);
      localStorage.setItem('token', data.token); // Guardar token en localStorage
      closeLoginModal(); // Cerrar el modal después del login exitoso
    } catch (err) {
      setError(err.message);
    }
  };

  // Función que se llama al presionar Enter
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin(); // Ejecuta el login al presionar Enter
    }
  };

  return (
    <div className="login-modal" onClick={closeLoginModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeLoginModal}>×</button>
        <h2>LOG IN</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(''); // Limpiar error al escribir
          }}
          onKeyDown={handleKeyPress} // Detecta Enter al escribir
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(''); // Limpiar error al escribir
          }}
          onKeyDown={handleKeyPress} // Detecta Enter al escribir
        />
        <button className="login-btn" onClick={handleLogin}>Log In</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginModal;
