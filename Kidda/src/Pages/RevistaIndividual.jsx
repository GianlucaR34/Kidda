import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importamos useParams para acceder al parámetro de la URL
import MagazineViewer from '../Components/MagazineViewer';

const RevistaIndividual = () => {
  const { id } = useParams(); // Obtenemos el id de la URL
  const [magazine, setMagazine] = useState(null);

  useEffect(() => {
    // Fetch the magazine by its ID
    const fetchMagazine = async () => {
      const response = await fetch(`http://localhost:5000/magazines/${id}`);
      const data = await response.json();
      setMagazine(data); // Establece la revista cargada
    };

    fetchMagazine();
  }, [id]);

  if (!magazine) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Revista Interactiva: {magazine.title}</h1>
      {/* Pasamos la URL del PDF al componente MagazineViewer */}
      <MagazineViewer pdfUrl={`http://localhost:5000/uploads/${magazine.filename}`} />
    </div>
  );
};

export default RevistaIndividual;