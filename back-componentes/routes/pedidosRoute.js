const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController'); // Importa el controlador

router.get('/', pedidosController.getAllPedidos);

module.exports = router;
