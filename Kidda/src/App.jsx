import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Nav from './Components/Nav';
import Footer from './Components/Footer';
import MainPage from './Pages/MainPage';
import Revistas from './Pages/Revistas';
import Panel from './Pages/Panel';
import RevistaIndividual from './Pages/RevistaIndividual';
import NotFound from './Components/NotFound';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.role === 'admin') {
            setUser(data);
          } else {
            setUser(null);
          }
        })
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <BrowserRouter>
      <div id="root">
        <Nav />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/revistas" element={<Revistas />} />
            <Route path="/revista-individual/:id" element={<RevistaIndividual />} />
            {/* Ruta protegida para el panel de administración */}
            <Route path="/admin" element={user ? <Panel /> : <Navigate to="/" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
