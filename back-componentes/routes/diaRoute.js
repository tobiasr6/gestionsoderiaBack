const express = require('express');
const router = express.Router();
const diaController = require('../controllers/diaController'); // Importa el controlador

router.get('/', diaController.getAllDias);

module.exports = router;
