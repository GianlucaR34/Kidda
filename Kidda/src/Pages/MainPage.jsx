import React from 'react';
import '../Styles/MainPage.css'; // Asegúrate de tener el archivo CSS correcto

function PaginaPrincipal() {
  return (
    <div className="container">
      <div className="text-expediente">EXPEDIENTE</div>
      <div className="custom-shape"></div>
      <div className="text-kidda">KIDDA</div>

      {/* Nueva forma circular con enlace */}
      <a href="https://www.instagram.com/kidda.visual/" className="circle-link" target="_blank" rel="noopener noreferrer">
  <div className="circle-shape">
    <span className="circle-text">
      Pedime tu <br /> contraseña <br /> por <br /> Instagram
    </span>
  </div>
</a>

    </div>
  );
}

export default PaginaPrincipal;
