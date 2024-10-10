const db = require('../config/db'); // Importa la conexión a la base de datos

const getAllPedidos = async (req, res) => {
    const query = 'SELECT * FROM pedidos';
    try {
        const [results] = await db.query(query); // Realiza la consulta usando await
        res.json(results); // Devuelve los resultados
    } catch (err) {
        console.error('Error al obtener los pedidos', err); // Log de error
        return res.status(500).json({ error: 'Error al obtener los pedidos' }); // Respuesta de error
    }
};

module.exports = {
    getAllPedidos,
};
