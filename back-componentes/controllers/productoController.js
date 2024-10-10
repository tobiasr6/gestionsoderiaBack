const db = require('../config/db'); // Importa la conexión a la base de datos

const getAllProductos = async (req, res) => {
    const query = 'SELECT * FROM producto';
    try {
        const [results] = await db.query(query); // Realiza la consulta usando await
        res.json(results); // Devuelve los resultados
    } catch (err) {
        console.error('Error al obtener los productos', err); // Log de error
        return res.status(500).json({ error: 'Error al obtener los productos' }); // Respuesta de error
    }
};

module.exports = {
    getAllProductos,
};
