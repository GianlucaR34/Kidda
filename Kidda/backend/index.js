import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs'; // Asegúrate de importar fs
import mongoose from 'mongoose';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import Magazine from './models/Magazine.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

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
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const { title, password } = req.body;
  
  if (!file) {
    return res.status(400).send('No se subió ningún archivo');
  }

  // Crear una nueva revista en la base de datos
  const magazine = new Magazine({
    title,
    filename: file.filename,
    password,
  });

  await magazine.save();
  
  res.status(200).send({
    message: 'Revista subida exitosamente',
    magazine,
  });
});

// Ruta para eliminar un archivo de revistas
app.delete('/magazines/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = `uploads/${filename}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).send('Archivo no encontrado');
    }
    res.status(200).send({
      message: 'Archivo eliminado exitosamente',
    });
  });
});

// Ruta para listar todas las revistas disponibles
app.get('/magazines', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Error al leer la carpeta de archivos');
    }
    res.status(200).json({ files }); // Retorna la lista de archivos en la carpeta uploads
  });
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
