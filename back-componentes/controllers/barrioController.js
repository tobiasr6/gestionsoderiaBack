const pool = require('../config/db'); // Asegúrate de importar tu pool de conexiones

// Función para obtener todos los barrios
const getAllBarrios = async (req, res) => {
    const query = 'SELECT * FROM barrio';

    try {
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los barrios:', err);
        return res.status(500).json({ error: 'Error al obtener los barrios' });
    }
};

module.exports = {
    getAllBarrios,
};
