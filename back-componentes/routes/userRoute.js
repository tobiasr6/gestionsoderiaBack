// back-componentes/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Importa el controlador

// Ruta para obtener todos los usuarios
router.get('/', userController.getAllUsers);

module.exports = router;
