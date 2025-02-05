import React from 'react';
import MagazineViewer from '../Components/MagazineViewer'; // Importa el componente MagazineViewer

const RevistaIndividual = () => {
  // URL del PDF (puedes cambiarla por la ruta correcta)
  const pdfUrl = '/Revista.pdf';

  return (
    <div>
      <h1>Revista Interactiva</h1>
      <MagazineViewer pdfUrl={pdfUrl} /> {/* Integra el MagazineViewer */}
    </div>
  );
};

export default RevistaIndividual;