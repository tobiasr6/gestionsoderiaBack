// back-componentes/controllers/userController.js
const db = require('../config/db'); // Asegúrate de importar tu conexión a la base de datos

// Función para obtener todos los usuarios
const getAllUsers = (req, res) => {
    const query = 'SELECT * FROM usuario'; // Cambia 'users' por el nombre de tu tabla

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
        res.json(results);
    });
};

module.exports = {
    getAllUsers,
};
