const express = require('express');
const { getAllClientes, addCliente, deleteCliente, editCliente, getClienteById } = require('../controllers/clientesController');
const router = express.Router();

// Rutas GET y POST para clientes
router.get('/', getAllClientes); // Ruta para obtener todos los clientes
router.post('/', addCliente); // Ruta para agregar un nuevo cliente
router.delete('/:idCliente', deleteCliente) //Ruta para eliminar un cliente
router.put('/:idCliente', editCliente) //Ruta para editar un cliente
router.get('/:idCliente', getClienteById) //Ruta para obtener un cliente por id


module.exports = router;
