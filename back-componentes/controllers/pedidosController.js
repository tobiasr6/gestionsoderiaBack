const db = require('../config/db'); 

const getAllPedidos = (req, res) => {
    const query = 'SELECT * FROM pedidos';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los pedidos', err);
            return res.status(500).json({ error: 'Error al obtener los pedidos' });
        }
        res.json(results);
    });
};

module.exports = {
    getAllPedidos,
};