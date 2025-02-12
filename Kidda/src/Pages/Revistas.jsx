import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import '../styles/Revistas.css';

function SeccionRevistas() {
  const [magazines, setMagazines] = useState([]);
  const navigate = useNavigate(); // Inicializamos useNavigate

  useEffect(() => {
    fetch('http://localhost:5000/magazines')
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos recibidos desde el backend:', data);
        setMagazines(data);
      })
      .catch((error) => {
        console.error('Error al obtener las revistas:', error);
      });
  }, []);

  const handleNavigate = (id) => {
    console.log(`Navegando a la revista con ID: ${id}`); // Verifica que se ejecuta correctamente
    navigate(`/revista-individual/${id}`);
  };

  return (
    <div className="revistas-container">
      <h1>The Gallery</h1>
      <div className="revistas-grid">
        {Array.isArray(magazines) && magazines.length > 0 ? (
          magazines.map((magazine) => {
            console.log('Revista renderizada:', magazine);
            return (
              <div 
                key={magazine._id} 
                className="revista-card"
                onClick={() => handleNavigate(magazine._id)} // Click en toda la tarjeta
                style={{ cursor: 'pointer' }} // Cambia el cursor para indicar que es clickeable
              >
                <img
                  src={
                    magazine.cover
                      ? `http://localhost:5000/uploads/${magazine.cover}`
                      : '/default-cover.jpg'
                  }
                  alt={`Portada de ${magazine.title}`}
                  className="revista-thumbnail"
                />
                <div className="revista-info">
                  <h3>{magazine.title}</h3>
                  <p>Subida el: {new Date(magazine.uploadDate).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No hay revistas disponibles</p>
        )}
      </div>
    </div>
  );
}

export default SeccionRevistas;
