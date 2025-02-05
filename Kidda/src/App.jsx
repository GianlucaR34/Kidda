import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Asegúrate de importar BrowserRouter, Route y Routes
import Nav from './Components/Nav'; // Importamos el componente Nav
import Footer from './Components/Footer'; // Importamos el componente Footer
import MainPage from './Pages/MainPage'; // Importamos la página principal
import Revistas from './Pages/Revistas'; // Importamos la página de revistas
import Panel from './Pages/Panel'; // Importamos la página del panel

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<MainPage />} />  
        <Route path="/revistas" element={<Revistas />} /> 
        <Route path="/panel" element={<Panel />} /> 
        <Route path="/revista-individual" element={<Panel />} /> 
        <Route path="/admin" element={<Panel />} /> 
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
