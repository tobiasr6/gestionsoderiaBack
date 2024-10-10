const pool = require('../config/db'); // Asegúrate de importar tu pool de conexiones

// Función para obtener todas las entregas
const getAllEntregas = async (req, res) => {
    const query = 'SELECT * FROM entrega';

    try {
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener las entregas:', err);
        return res.status(500).json({ error: 'Error al obtener las entregas' });
    }
};

module.exports = {
    getAllEntregas,
};
