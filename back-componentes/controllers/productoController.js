const db = require('../config/db'); 

const getAllProductos = (req, res) => {
    const query = 'SELECT * FROM producto';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los productos', err);
            return res.status(500).json({ error: 'Error al obtener los productos' });
        }
        res.json(results);
    });
};

module.exports = {
    getAllProductos,
};
