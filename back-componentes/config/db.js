const mysql = require('mysql2/promise'); // Importa el módulo mysql2 con soporte de promesas
require('dotenv').config();

// Crea un pool de conexiones a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10 // Ajusta según la necesidad de tu aplicación
});

// Exporta el pool para que pueda ser utilizado en otros módulos
module.exports = pool;
