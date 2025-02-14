import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import mongoose from 'mongoose';
import Magazine from './models/Magazine.js';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './models/auth.js'; // Importamos el router de autenticación
import User from './models/User.js';  // Asegúrate de que la ruta sea correcta

const app = express();
const port = 5000;

// Solucionamos el problema de __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear la carpeta 'uploads' si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configurar Multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // La carpeta donde se guardarán los archivos subidos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nombrar el archivo con un prefijo de timestamp
  },
});

const upload = multer({ storage });

// Conexión a MongoDB (sin las opciones obsoletas)
mongoose.connect('mongodb://localhost:27017/revistas')
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });

// Ruta principal para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Ruta para subir archivos y manejar revistas
app.post('/upload', upload.fields([
  { name: 'pdfA3' },  // PDF en formato A3
  { name: 'pdfA4' },  // PDF en formato A4
  { name: 'cover' }   // Portada
]), async (req, res) => {
  const files = req.files;
  const { title, password } = req.body;

  console.log('Archivos recibidos:', files);  // Verifica si "pdfA3", "pdfA4" y "cover" están presentes

  if (!files || !files.pdfA3 || !files.pdfA4 || !files.cover) {
    return res.status(400).send('Se requieren los archivos PDF en A3 y A4, además de la portada.');
  }

  try {
    // Crear una nueva revista en la base de datos
    const magazine = new Magazine({
      title,
      pdfA3: files.pdfA3[0].filename, // Guardar PDF en A3
      pdfA4: files.pdfA4[0].filename, // Guardar PDF en A4
      cover: files.cover[0].filename, // Guardar portada
      password,
    });

    await magazine.save();

    res.status(200).send({
      message: 'Revista subida exitosamente',
      magazine,
    });
  } catch (error) {
    console.error('Error al guardar la revista:', error);
    res.status(500).send('Error al guardar la revista');
  }
});

// Ruta para eliminar un archivo de revistas
app.delete('/magazines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar la revista en la base de datos
    const magazine = await Magazine.findById(id);

    if (!magazine) {
      return res.status(404).send('Revista no encontrada en la base de datos');
    }

    // Mostrar los nombres de los archivos que vamos a eliminar (para depuración)
    console.log("Archivos a eliminar:");
    console.log("PDF A3:", magazine.pdfA3);
    console.log("PDF A4:", magazine.pdfA4);
    console.log("Portada:", magazine.cover);

    // Rutas de los archivos, usando los nombres almacenados en la base de datos
    const pdfA3Path = path.join(uploadDir, magazine.pdfA3); // Usar el nombre del archivo almacenado
    const pdfA4Path = path.join(uploadDir, magazine.pdfA4); // Usar el nombre del archivo almacenado
    const coverPath = path.join(uploadDir, magazine.cover); // Usar el nombre del archivo almacenado

    // Mostrar las rutas completas de los archivos (para depuración)
    console.log("Ruta completa A3:", pdfA3Path);
    console.log("Ruta completa A4:", pdfA4Path);
    console.log("Ruta completa Portada:", coverPath);

    // Eliminar la entrada de la base de datos
    await Magazine.deleteOne({ _id: id });

    // Eliminar los archivos físicos (si existen)
    if (fs.existsSync(pdfA3Path)) {
      fs.unlinkSync(pdfA3Path);
      console.log("Archivo A3 eliminado");
    } else {
      console.log("No se encontró el archivo A3");
    }

    if (fs.existsSync(pdfA4Path)) {
      fs.unlinkSync(pdfA4Path);
      console.log("Archivo A4 eliminado");
    } else {
      console.log("No se encontró el archivo A4");
    }

    if (fs.existsSync(coverPath)) {
      fs.unlinkSync(coverPath);
      console.log("Portada eliminada");
    } else {
      console.log("No se encontró la portada");
    }

    // Responder con éxito
    res.status(200).send({ message: 'Revista, portada y archivos eliminados exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la revista:', error);
    res.status(500).send('Error al eliminar la revista');
  }
});

// Ruta para listar todas las revistas disponibles
app.get('/magazines', async (req, res) => {
  try {
    const magazines = await Magazine.find(); // Recupera todas las revistas
    console.log('Revistas enviadas al frontend:', magazines); // DEBUG: Ve qué datos se están enviando
    res.status(200).json(magazines); // Envía las revistas al frontend
  } catch (error) {
    console.error('Error al obtener las revistas:', error);
    res.status(500).send('Error al obtener las revistas');
  }
});

// Ruta para obtener una revista por su ID
app.get('/magazines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const magazine = await Magazine.findById(id); // Busca la revista por ID
    if (!magazine) {
      return res.status(404).send('Revista no encontrada');
    }
    res.status(200).json(magazine); // Devuelve la revista encontrada
  } catch (error) {
    console.error('Error al obtener la revista:', error);
    res.status(500).send('Error al obtener la revista');
  }
});

// Usar el router de autenticación
app.use('/auth', authRouter);  // Usa el router de auth aquí

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
