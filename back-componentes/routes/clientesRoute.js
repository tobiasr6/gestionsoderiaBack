// back-componentes/routes/users.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clientesController'); // Importa el controlador

// Ruta para obtener todos los usuarios
router.get('/', clienteController.getAllClientes);

module.exports = router;
