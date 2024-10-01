const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController'); // Importa el controlador

router.get('/', productoController.getAllProductos);

module.exports = router;
