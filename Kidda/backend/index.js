import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs'; // Asegúrate de importar fs
import mongoose from 'mongoose';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import Magazine from './models/Magazine.js';
import path from 'path';  // Importamos path
import { fileURLToPath } from 'url'; // Importamos fileURLToPath

const app = express();
const port = 5000;

// Solucionamos el problema de __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar Multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // La carpeta donde se guardarán los archivos subidos
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

// Rutas para subir archivos y manejar revistas
app.post('/upload', upload.fields([{ name: 'file' }, { name: 'cover' }]), async (req, res) => {
  const files = req.files;
  const { title, password } = req.body;

  console.log('Archivos recibidos:', files);  // Verifica si "cover" y "file" están presentes

  if (!files || !files.file || !files.cover) {
    return res.status(400).send('Se requieren tanto el archivo PDF como la portada.');
  }

  try {
    // Crear una nueva revista en la base de datos
    const magazine = new Magazine({
      title,
      filename: files.file[0].filename, // PDF subido
      cover: files.cover[0].filename,   // Portada subida
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
app.delete('/magazines/:filename', async (req, res) => {
  const { filename } = req.params;
  const pdfPath = `uploads/${filename}`;

  try {
    // Buscar la revista en la base de datos
    const magazine = await Magazine.findOne({ filename });

    if (!magazine) {
      return res.status(404).send('Revista no encontrada en la base de datos');
    }

    // Eliminar la entrada de la base de datos
    await Magazine.deleteOne({ filename });

    // Eliminar el archivo PDF
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    // Eliminar la portada asociada
    if (magazine.cover) {
      const coverPath = `uploads/${magazine.cover}`;
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    // Responder con éxito
    res.status(200).send({ message: 'Revista, portada y archivo PDF eliminados exitosamente' });
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

// Rutas de autenticación (login)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send('Usuario o contraseña incorrectos');
  }
  
  const token = jwt.sign({ userId: user._id, role: user.role }, 'secreto', { expiresIn: '1h' });
  res.json({ token });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
