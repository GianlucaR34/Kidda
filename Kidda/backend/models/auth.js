import express from 'express';
import User from './User.js';  // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Para encriptar contraseñas

const router = express.Router();

// Ruta para registrar usuarios
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario en la base de datos
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Ruta para login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Generar JWT
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para verificar si el usuario está autenticado
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del header

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'secretKey'); // Verifica el token
    res.json({ userId: decoded.id, role: decoded.role });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
});

export default router;
