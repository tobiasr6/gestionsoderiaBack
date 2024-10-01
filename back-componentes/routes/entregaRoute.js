const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController'); // Importa el controlador

router.get('/', entregaController.getAllEntregas);

module.exports = router;
