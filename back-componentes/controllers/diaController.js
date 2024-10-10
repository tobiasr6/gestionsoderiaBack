const pool = require('../config/db'); // Asegúrate de importar tu pool de conexiones

// Función para obtener todos los días
const getAllDias = async (req, res) => {
    const query = 'SELECT * FROM dia';

    try {
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los días:', err);
        return res.status(500).json({ error: 'Error al obtener los días' });
    }
};

module.exports = {
    getAllDias,
};
