cd e-learning-backend
npm install bcryptjs jsonwebtoken

JWT_SECRET=tu_clave_super_secreta
JWT_EXPIRES_IN=1d   # 1 día (puedes ajustar el tiempo)

/e-learning-backend/controllers/authController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },      // Payload
      process.env.JWT_SECRET,                // Clave secreta
      { expiresIn: process.env.JWT_EXPIRES_IN } // Expiración
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);

export default router;



