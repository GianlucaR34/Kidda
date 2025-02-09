import express from 'express'; 
import cors from 'cors';
import multer from 'multer';
import fs from 'fs'; // Asegúrate de importar fs

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No se subió ningún archivo');
  }
  res.status(200).send({
    filename: file.filename,
    message: 'Archivo subido exitosamente',
  });
});

// Ruta para eliminar un archivo
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
// Ruta para listar archivos (revistas)
app.get('/magazines', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Error al leer la carpeta de archivos');
    }
    res.status(200).json({ files }); // Retorna la lista de archivos
  });
});