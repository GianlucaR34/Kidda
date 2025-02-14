import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MagazineViewer from "../Components/MagazineViewer";
import { isMobile } from "react-device-detect"; // Usar react-device-detect para saber si es un móvil
import "../styles/RevistaIndividual.css";

const RevistaIndividual = () => {
  const { id } = useParams();
  const [magazine, setMagazine] = useState(null);
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        const response = await fetch(`http://localhost:5000/magazines/${id}`);
        const data = await response.json();
        setMagazine(data);
      } catch (error) {
        console.error('Error fetching magazine:', error);
      }
    };

    fetchMagazine();
  }, [id]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (magazine && password === magazine.password) {
      setIsPasswordCorrect(true);
    } else {
      alert('Contraseña incorrecta.');
    }
  };

  if (!magazine) return <div className="loading">Cargando...</div>;

  return (
    <div className={`revista-container ${isPasswordCorrect ? 'blurred' : ''}`}>
      {!isPasswordCorrect ? (
        <div className="password-container">
          <h2>Ingresa la contraseña</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              className="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
            <button type="submit" className="password-submit">Ver revista</button>
          </form>
        </div>
      ) : (
        <div className="pdf-viewer-container">
          {/* Dependiendo si es móvil o no, cargar el PDF correspondiente */}
          <MagazineViewer 
            pdfUrl={isMobile ? `http://localhost:5000/uploads/${magazine.pdfA4}` : `http://localhost:5000/uploads/${magazine.pdfA3}`} 
          />
        </div>
      )}
    </div>
  );
};

export default RevistaIndividual;
