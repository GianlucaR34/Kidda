import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './Components/Nav';
import Footer from './Components/Footer';
import MainPage from './Pages/MainPage';
import Revistas from './Pages/Revistas';
import Panel from './Pages/Panel';
import RevistaIndividual from './Pages/RevistaIndividual';

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/revistas" element={<Revistas />} />
        <Route path="/revista-individual/:id" element={<RevistaIndividual />} /> {/* Ruta dinámica */}
        <Route path="/admin" element={<Panel />} /> 
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
