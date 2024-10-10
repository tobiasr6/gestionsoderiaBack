const pool = require('../config/db'); // Importa el pool de conexiones

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Consulta a la base de datos para obtener el usuario
        const [rows] = await pool.query('SELECT * FROM usuario WHERE nombre = ?', [username]);

        // Verificar si se encontró el usuario
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];

        // Comparar la contraseña directamente
        if (password !== user.password) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        if (user.estado !== 'activo') {
            return res.status(403).json({ message: 'Usuario desactivado' });
        }

        // Devolver datos del usuario si todo es correcto
        return res.status(200).json({
            idUsuario: user.idusuario,
            nombre: user.nombre,
            mensaje: 'Inicio de sesión exitoso'
        });
    } catch (error) {
        console.error('Error en la consulta:', error); // Log de error
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};
