import express from 'express';
import dotenv from 'dotenv';
import User from './User.js';  // Asegúrate de que la ruta sea correcta
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config(); // Cargar variables de entorno

console.log('JWT_SECRET:', process.env.JWT_SECRET);


const router = express.Router();

// Ruta para login (el único usuario permitido es el admin que ya definiste)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Generar JWT con clave secreta desde .env
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,  // 🔹 Usa la clave secreta segura
      { expiresIn: process.env.JWT_EXPIRES || '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Middleware para verificar autenticación
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrae el token

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token con la clave secreta
    req.user = decoded; // Guarda el usuario en req.user para usarlo en rutas protegidas
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Ruta protegida (solo accesible si el usuario está autenticado)
router.get('/verify', verificarToken, (req, res) => {
  res.json({ userId: req.user.id, role: req.user.role });
});

export default router;
