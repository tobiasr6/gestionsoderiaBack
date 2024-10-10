const db = require('../config/db'); // Asegúrate de importar tu conexión a la base de datos

// Función para obtener todos los usuarios
const getAllUsers = async (req, res) => {
    const query = 'SELECT * FROM usuario'; // Asegúrate de que el nombre de la tabla sea correcto

    try {
        const [results] = await db.query(query); // Realiza la consulta usando await
        res.json(results); // Devuelve los resultados
    } catch (err) {
        console.error('Error al obtener los usuarios:', err); // Log de error
        return res.status(500).json({ error: 'Error al obtener los usuarios' }); // Respuesta de error
    }
};

module.exports = {
    getAllUsers,
};
