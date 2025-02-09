import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [magazines, setMagazines] = useState([]);

  // Cargar las revistas al inicio
  useEffect(() => {
    const fetchMagazines = async () => {
      const response = await fetch('http://localhost:5000/magazines');
      const data = await response.json();
      setMagazines(data); // Asumiendo que el servidor responde con un array de revistas
    };

    fetchMagazines();
  }, []);

  // Manejar el cambio del archivo que se va a subir
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Subir el archivo al backend
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);  // Añadir el título
    formData.append('password', password);  // Añadir la contraseña

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log(data.message); // Muestra "Revista subida exitosamente"
    setMagazines([...magazines, data]); // Añadir los detalles de la nueva revista
  };

  const deleteMagazine = async (filename) => {
    try {
      console.log('Eliminando archivo:', filename); // Verifica el filename
  
      const response = await fetch(`http://localhost:5000/magazines/${filename}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Revista no encontrada');
      }
  
      const data = await response.json();
      console.log(data.message); // Muestra "Archivo eliminado exitosamente"
  
      // Filtra las revistas eliminadas de la lista en el frontend
      setMagazines((prevMagazines) =>
        prevMagazines.filter((magazine) => magazine.filename !== filename)
      );
    } catch (error) {
      console.error('Error al eliminar la revista:', error.message); // Manejo del error
      alert('No se pudo eliminar la revista: ' + error.message);
    }
  };
  

  return (
    <div>
      <h2>Panel de Administración</h2>

      {/* Subir nueva revista */}
      <div>
        <h3>Subir Nueva Revista</h3>
        <input 
          type="text" 
          placeholder="Título de la revista" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Contraseña para acceder" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Subir Revista</button>
      </div>

      {/* Lista de revistas */}
      <div>
        <h3>Revistas Disponibles</h3>
        <ul>
          {magazines.map((magazine, index) => (
            <li key={index}>
              <p>Título: {magazine.title}</p>
              <p>Contraseña: {magazine.password}</p>
              <p>Fecha de subida: {new Date(magazine.uploadDate).toLocaleDateString()}</p>
              <button onClick={() => deleteMagazine(magazine.filename)}>Eliminar</button> {/* Se pasa el filename */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
