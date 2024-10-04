const express = require('express');
const { getAllClientes, addCliente, deleteCliente } = require('../controllers/clientesController');
const router = express.Router();

// Rutas GET y POST para clientes
router.get('/', getAllClientes); // Ruta para obtener todos los clientes
router.post('/', addCliente); // Ruta para agregar un nuevo cliente
router.delete('/:idCliente', deleteCliente) //Ruta para eliminar un cliente

module.exports = router;
