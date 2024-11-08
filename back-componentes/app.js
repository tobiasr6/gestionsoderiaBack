const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');

//! COMPONENTES
const userRoutes = require('./routes/userRoute'); 
const barrioRoutes = require('./routes/barriosRoute');
const zonaRoutes = require('./routes/zonasRoute');
const clientesRoute = require('./routes/clientesRoute');
const productoRoute = require('./routes/productoRoute');
const pedidoRoute = require('./routes/pedidosRoute');
const entregaRoute = require('./routes/entregaRoute');
const diaRoute = require('./routes/diaRoute');
const authRoutes = require('./routes/authRoutes');
const estadoRoutes = require('./routes/estadoRoutes')

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

app.use(morgan('dev'));
app.use(express.json()); // Permite que la app maneje JSON
app.use(cors({ origin: '*' })); // Permitir todas las solicitudes CORS

//! RUTAS
app.use('/api/users', userRoutes); // La ruta base para usuarios
app.use('/api/barrios', barrioRoutes);
app.use('/api/zonas', zonaRoutes);
app.use('/api/clientes', clientesRoute); // Aquí se manejan GET, POST, DELETE
app.use('/api/producto', productoRoute);
app.use('/api/pedidos', pedidoRoute);
app.use('/api/entrega', entregaRoute);
app.use('/api/dia', diaRoute);
app.use('/api', authRoutes);
app.use('/api/estado', estadoRoutes)

// Ruta simple para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('Servidor y conexión a la base de datos funcionando');
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
