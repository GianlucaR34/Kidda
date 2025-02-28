import React, { useState, useEffect } from "react";
import "../Styles/Panel.css";

const AdminPanel = () => {
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null); // Nuevo estado para la portada
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [pdfA4, setPdfA4] = useState(null); // Nuevo estado para el PDF A4
  const [magazines, setMagazines] = useState([]);

  // Cargar las revistas al inicio
  useEffect(() => {
    const fetchMagazines = async () => {
      const response = await fetch("http://localhost:5000/magazines");
      const data = await response.json();
      setMagazines(data); // Asumiendo que el servidor responde con un array de revistas
    };

    fetchMagazines();
  }, []);

  // Manejar el cambio del archivo PDF A3 que se va a subir
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Manejar el cambio del archivo PDF A4
  const handlePdfA4Change = (event) => {
    setPdfA4(event.target.files[0]);
  };

  // Manejar el cambio de la portada
  const handleCoverChange = (event) => {
    setCover(event.target.files[0]);
  };

  // Subir el archivo y la portada al backend
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("pdfA3", file); // Aquí usas el nombre correcto 'pdfA3'
    formData.append("pdfA4", pdfA4); // Aquí usas el nombre correcto 'pdfA4'
    formData.append("cover", cover); // Aquí usas el nombre correcto 'cover'
    formData.append("title", title); // Añadir el título
    formData.append("password", password); // Añadir la contraseña

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data.message); // Muestra "Revista subida exitosamente"
    setMagazines([...magazines, data.magazine]); // Añadir los detalles de la nueva revista
  };

  // Función para eliminar la revista
  const deleteMagazine = async (id) => {
    console.log("ID a eliminar:", id); // Verifica que el ID es el correcto
    try {
      const response = await fetch(`http://localhost:5000/magazines/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setMagazines(magazines.filter((magazine) => magazine._id !== id)); // Usamos el '_id' para filtrar
        alert('Revista eliminada exitosamente');
      } else {
        alert('Error al eliminar la revista');
      }
    } catch (error) {
      console.error('Error al eliminar la revista:', error);
      alert('Error al eliminar la revista');
    }
  };
  return (
    <div className="admin-container">
      <h2>PANEL DE ADMINISTRACION</h2>

      {/* Subir nueva revista */}
      <div className="upload-section">
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

        {/* Input para subir la revista A3 */}
        <div className="file-input-container">
          <label htmlFor="fileInput">
            Seleccionar revista A3 (doble página)
          </label>
          <input type="file" id="fileInput" onChange={handleFileChange} />
        </div>

        {/* Input para subir la revista A4 */}
        <div className="file-input-container">
          <label htmlFor="pdfA4Input">
            Seleccionar revista A4 (páginas individuales)
          </label>
          <input type="file" id="pdfA4Input" onChange={handlePdfA4Change} />
        </div>

        {/* Input para subir la portada */}
        <div className="file-input-container">
          <label htmlFor="coverInput">Seleccionar portada</label>
          <input type="file" id="coverInput" onChange={handleCoverChange} />
        </div>

        <button className="upload-button" onClick={handleFileUpload}>
          Subir Revista
        </button>
      </div>

      {/* Lista de revistas */}
      <div className="magazines-list">
        <h3>Revistas Disponibles</h3>
        <ul>
          {magazines.map((magazine, index) => (
            <li key={index}>
              <p>Título: {magazine.title}</p>
              <p>Contraseña: {magazine.password}</p>
              <p>
                Fecha de subida:{" "}
                {new Date(magazine.uploadDate).toLocaleDateString()}
              </p>
              <button
                className="delete-button"
                onClick={() => deleteMagazine(magazine._id)} // Usamos el '_id' aquí en lugar de 'filename'
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
