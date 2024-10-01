const db = require('../config/db'); 

const getAllDias = (req, res) => {
    const query = 'SELECT * FROM dia';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los dias', err);
            return res.status(500).json({ error: 'Error al obtener los dias' });
        }
        res.json(results);
    });
};

module.exports = {
    getAllDias,
};