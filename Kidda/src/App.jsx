import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './Components/Nav';
import Footer from './Components/Footer';
import MainPage from './Pages/MainPage';
import Revistas from './Pages/Revistas';
import Panel from './Pages/Panel';
import RevistaIndividual from './Pages/RevistaIndividual';
import NotFound from './Components/NotFound'; // Importa la página de error 404

const App = () => {
  return (
    <BrowserRouter>
      <div id="root">
        <Nav />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/revistas" element={<Revistas />} />
            <Route path="/revista-individual/:id" element={<RevistaIndividual />} />
            <Route path="/admin" element={<Panel />} />
            {/* Ruta para manejar las páginas no encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
