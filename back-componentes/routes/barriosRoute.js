// back-componentes/routes/users.js
const express = require('express');
const router = express.Router();
const barrioController = require('../controllers/barrioController'); // Importa el controlador

// Ruta para obtener todos los usuarios
router.get('/', barrioController.getAllBarrios);

module.exports = router;
