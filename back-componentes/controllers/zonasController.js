const db = require('../config/db'); // Asegúrate de importar tu conexión a la base de datos

// Función para obtener todas las zonas
const getAllZonas = async (req, res) => {
    const query = 'SELECT * FROM zona'; // Asegúrate de que el nombre de la tabla sea correcto

    try {
        const [results] = await db.query(query); // Realiza la consulta usando await
        res.json(results); // Devuelve los resultados
    } catch (err) {
        console.error('Error al obtener las zonas:', err); // Log de error
        return res.status(500).json({ error: 'Error al obtener las zonas' }); // Respuesta de error
    }
};

module.exports = {
    getAllZonas,
};
