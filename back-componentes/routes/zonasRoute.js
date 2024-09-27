// back-componentes/routes/users.js
const express = require('express');
const router = express.Router();
const zonaController = require('../controllers/zonasController'); // Importa el controlador

// Ruta para obtener todos los usuarios
router.get('/', zonaController.getAllZonas);

module.exports = router;
