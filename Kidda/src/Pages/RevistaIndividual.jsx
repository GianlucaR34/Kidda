import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importamos useParams para acceder al parámetro de la URL
import MagazineViewer from '../Components/MagazineViewer';
import '../styles/RevistaIndividual.css';

const RevistaIndividual = () => {
  const { id } = useParams(); // Obtenemos el id de la URL
  const [magazine, setMagazine] = useState(null);
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false); // Estado para controlar si la contraseña es correcta

  useEffect(() => {
    // Fetch the magazine by its ID
    const fetchMagazine = async () => {
      const response = await fetch(`http://localhost:5000/magazines/${id}`);
      const data = await response.json();
      setMagazine(data); // Establece la revista cargada
    };

    fetchMagazine();
  }, [id]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === magazine.password) {
      setIsPasswordCorrect(true); // Si la contraseña es correcta, permite ver la revista
    } else {
      alert('Contraseña incorrecta.'); // Mensaje de error si la contraseña es incorrecta
    }
  };

  if (!magazine) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Revista Interactiva: {magazine.title}</h1>
      
      {!isPasswordCorrect ? (
        <div className="password-container">
          <h2>Ingresa la contraseña para ver la revista</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input
              className="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
            <button className="password-submit" type="submit">Ver revista</button>
          </form>
          {/* Mostrar error si la contraseña es incorrecta */}
          {password && !isPasswordCorrect && (
            <div className="password-error">Contraseña incorrecta.</div>
          )}
        </div>
      ) : (
        <MagazineViewer pdfUrl={`http://localhost:5000/uploads/${magazine.filename}`} />
      )}
    </div>
  );
};

export default RevistaIndividual;
