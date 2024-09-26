// back-componentes/middleware/logger.js
const logger = (req, res, next) => {
    console.log(`${req.method}${req.url} ${res.statusCode} `);
    next(); // pasa el control al siguiente middleware
};

module.exports = logger;
