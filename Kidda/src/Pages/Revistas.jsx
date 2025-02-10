import React, { useState, useEffect } from 'react';
import '../styles/Revistas.css';

function SeccionRevistas() {
  const [magazines, setMagazines] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/magazines') // Llama a la API de tu backend
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos recibidos desde el backend:', data); // DEBUG: Revisa qué llega
        setMagazines(data);
      })
      .catch((error) => {
        console.error('Error al obtener las revistas:', error);
      });
  }, []);

  return (
    <div className="revistas-container">
      <h1>Revistas Disponibles</h1>
      <div className="revistas-grid">
        {Array.isArray(magazines) && magazines.length > 0 ? (
          magazines.map((magazine) => (
            <div key={magazine._id} className="revista-card">
              <img
                src={
                  magazine.cover
                    ? `http://localhost:5000/uploads/${magazine.cover}`
                    : '/default-cover.jpg' // Imagen por defecto
                }
                alt={`Portada de ${magazine.title}`}
                className="revista-thumbnail"
              />
              <div className="revista-info">
                <h3>{magazine.title}</h3>
                <p>Subida el: {new Date(magazine.uploadDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay revistas disponibles</p>
        )}
      </div>
    </div>
  );
}

export default SeccionRevistas;
