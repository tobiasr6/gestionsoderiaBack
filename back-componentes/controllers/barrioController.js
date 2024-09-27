// back-componentes/controllers/userController.js
const db = require('../config/db'); // Asegúrate de importar tu conexión a la base de datos

// Función para obtener todos los barrios
const getAllBarrios = (req, res) => {
    const query = 'SELECT * FROM barrio';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los barrios:', err);
            return res.status(500).json({ error: 'Error al obtener los barrios' });
        }
        res.json(results);
    });
};

module.exports = {
    getAllBarrios,
};
