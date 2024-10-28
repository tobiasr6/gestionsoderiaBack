// back-componentes/routes/users.js
const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoController'); // Importa el controlador

// Ruta para obtener todos los usuarios
router.get('/', estadoController.getAllEstado);

module.exports = router;
