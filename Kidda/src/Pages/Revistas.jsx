import React, { useState, useEffect } from 'react';

function SeccionRevistas() {
  const [magazines, setMagazines] = useState([]); // Inicializa como un array vacío
  
  useEffect(() => {
    fetch('http://localhost:5000/magazines') // Llama a la API de tu backend
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Revisa qué datos recibes
        setMagazines(data); // Actualiza el estado con los datos recibidos
      })
      .catch((error) => {
        console.error('Error al obtener las revistas:', error);
      });
  }, []);

  return (
    <div>
      <h1>Sección de Revistas</h1>
      <p>Aquí encontrarás todas las ediciones disponibles.</p>

      <ul>
        {/* Verifica si magazines es un array y tiene elementos */}
        {Array.isArray(magazines) && magazines.length > 0 ? (
          magazines.map((magazine) => (
            <li key={magazine._id}>
              <h3>{magazine.title}</h3>
              <p>Contraseña: {magazine.password}</p>
              <p>Fecha de subida: {new Date(magazine.uploadDate).toLocaleDateString()}</p>
            </li>
          ))
        ) : (
          <p>No hay revistas disponibles</p>
        )}
      </ul>
    </div>
  );
}

export default SeccionRevistas;