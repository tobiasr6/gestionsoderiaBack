// back-componentes/app.js
const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const logger = require('./middleware/logger');
const userRoutes = require('./routes/userRoute'); 
const barrioRoutes = require('./routes/barriosRoute');
const zonaRoutes = require('./routes/zonasRoute');
const clientesRoute = require('./routes/clientesRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Middleware
app.use(logger); // Usa tu middleware de logger
app.use(express.json()); // Permite que la app maneje JSON

// Verificar la conexión a MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

//!RUTAS GET
app.use('/api/users', userRoutes); // La ruta base para usuarios
app.use('/api/barrios', barrioRoutes);
app.use('/api/zonas', zonaRoutes);
app.use('/api/clientes', clientesRoute);

// Ruta simple para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('Servidor y conexión a la base de datos funcionando');
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
