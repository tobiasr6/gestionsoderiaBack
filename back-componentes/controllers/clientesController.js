const db = require('../config/db'); 

// Función para obtener todos los clientes
const getAllClientes = (req, res) => {
    const query = 'SELECT * FROM cliente';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los clientes:', err);
            return res.status(500).json({ error: 'Error al obtener los clientes' });
        }
        res.json(results);
    });
};

module.exports = {
    getAllClientes,
};
