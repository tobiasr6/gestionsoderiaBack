const db = require('../config/db'); 

const getAllEntregas = (req, res) => {
    const query = 'SELECT * FROM entrega';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las entregas', err);
            return res.status(500).json({ error: 'Error al obtener las entregas' });
        }
        res.json(results);
    });
};

module.exports = {
    getAllEntregas,
};