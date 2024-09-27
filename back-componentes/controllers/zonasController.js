// back-componentes/controllers/userController.js
const db = require('../config/db'); // Asegúrate de importar tu conexión a la base de datos

// Función para obtener todos los barrios
const getAllZonas = (req, res) => {
    const query = 'SELECT * FROM zona';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las zonas:', err);
            return res.status(500).json({ error: 'Error al obtener las zonas' });
        }
        res.json(results);
    });
};

module.exports = {
    getAllZonas,
};
