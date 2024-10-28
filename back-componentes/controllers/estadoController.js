const pool = require('../config/db'); // Asegúrate de importar tu pool de conexiones

// Función para obtener todos los estados
const getAllEstado = async (req, res) => {
    console.log("Entrando a la función getAllEstado");
    const query = 'SELECT * FROM estado';

    try {
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los estados:', err);
        return res.status(500).json({ error: 'Error al obtener los estados' });
    }
};

module.exports = {
    getAllEstado,
};
