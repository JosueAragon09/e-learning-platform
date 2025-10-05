npm install bcryptjs mongoose dotenv
PORT=5000
MONGO_URI=mongodb://localhost:27017/e-learning
BCRYPT_SALT_ROUNDS=10

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // aquí guardaremos el hash
  role: { type: String, default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const hashAsync = promisify(bcrypt.hash);
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    // Normalizar email
    const emailNormalized = email.toLowerCase().trim();

    // Comprobar si el email ya existe
    const existing = await User.findOne({ email: emailNormalized });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // SALT ROUNDS desde env o default 10
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

    // Hashear la contraseña (bcryptjs.hash con promisify)
    const hashedPassword = await hashAsync(password, saltRounds);

    // Crear y guardar el usuario
    const user = new User({
      name: name.trim(),
      email: emailNormalized,
      password: hashedPassword
    });

    await user.save();

    // No devolver la contraseña
    return res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', authController.register);

module.exports = router;

const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');

app.use(express.json());

// Conexión a MongoDB (ejemplo simple)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(err => console.error(err));

app.use('/api/auth', require('./routes/auth'));

app.listen(process.env.PORT || 5000, ()=> console.log('Server running'));

curl -X POST http://localhost:5000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"name":"Carlos Hernández","email":"carlos99@gmail.com","password":"UFG123!"}'

const compareAsync = promisify(bcrypt.compare);
const match = await compareAsync(plainPassword, user.password);
if (!match) return res.status(401).json({ message: 'Invalid credentials' });

git checkout -b feat/auth-register
git add .
git commit -m "feat(auth): add register controller with bcryptjs hashing"
git push origin feat/auth-register
