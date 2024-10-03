const db = require('../config/db'); 

const getAllClientes = (req, res) => {
    const query = `
        SELECT 
            c.idCliente AS id,
            c.nombre,
            c.direccion,
            n.nombreZona AS nombreZona,
            c.telefono,
            c.observaciones AS observaciones,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('cantidad', p.cantidad, 'producto', prod.tipoProducto)) 
             FROM pedidosinter p 
             JOIN producto prod ON p.idProducto = prod.idProducto 
             WHERE p.idCliente = c.idCliente) AS pedidos,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('dia', d.diaSemana)) 
             FROM clienteDia cd 
             JOIN dia d ON cd.idDia = d.idDia 
             WHERE cd.idCliente = c.idCliente) AS diasRecorrido
        FROM 
            cliente c
        JOIN 
            zona n ON c.idBarrio = n.idZona
        GROUP BY 
            c.idCliente;  -- Agrupar por cliente
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los clientes:', err);
            return res.status(500).json({ error: 'Error al obtener los clientes' });
        }
        res.json(results);
    });
};

const addCliente = (req, res) => {
    const { nombre, direccion, idBarrio, telefono, observaciones, pedidos, diasRecorrido } = req.body;

    // Obtener la zona correspondiente al barrio
    const queryZona = `SELECT idZona FROM barrio WHERE idBarrio = ?`;

    db.query(queryZona, [idBarrio], (err, resultZona) => {
        if (err) {
            console.error('Error al obtener la zona del barrio:', err);
            return res.status(500).json({ error: 'Error al obtener la zona del barrio' });
        }

        if (resultZona.length === 0) {
            return res.status(400).json({ error: 'Barrio no encontrado o sin zona asignada' });
        }

        const idZona = resultZona[0].idZona;

        // Insertar cliente en la tabla cliente con el barrio seleccionado
        const queryCliente = `
            INSERT INTO cliente (nombre, direccion, idBarrio, telefono, observaciones) 
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(queryCliente, [nombre, direccion, idBarrio, telefono, observaciones], (err, resultCliente) => {
            if (err) {
                console.error('Error al insertar el cliente:', err);
                return res.status(500).json({ error: 'Error al insertar el cliente' });
            }

            const idCliente = resultCliente.insertId;  // Obtenemos el ID del cliente recién insertado

            // Insertar pedidos en la tabla pedidosinter
            const queryPedido = `
                INSERT INTO pedidosinter (idCliente, cantidad, idProducto) 
                VALUES (?, ?, ?)
            `;

            pedidos.forEach((pedido) => {
                db.query(queryPedido, [idCliente, pedido.cantidad, pedido.producto], (err) => {
                    if (err) {
                        console.error('Error al insertar el pedido:', err);
                        return res.status(500).json({ error: 'Error al insertar el pedido' });
                    }
                });
            });

            // Insertar días de recorrido en la tabla clienteDia
            const queryDiaRecorrido = `
                INSERT INTO clienteDia (idCliente, idDia) 
                VALUES (?, ?)
            `;

            diasRecorrido.forEach((diaRecorrido) => {
                db.query(queryDiaRecorrido, [idCliente, diaRecorrido.dia], (err) => {
                    if (err) {
                        console.error('Error al insertar el día de recorrido:', err);
                        return res.status(500).json({ error: 'Error al insertar el día de recorrido' });
                    }
                });
            });

            // Consultar el nombre de la zona correspondiente
            const queryNombreZona = `SELECT nombreZona FROM zona WHERE idZona = ?`;
            db.query(queryNombreZona, [idZona], (err, resultNombreZona) => {
                if (err) {
                    console.error('Error al obtener el nombre de la zona:', err);
                    return res.status(500).json({ error: 'Error al obtener el nombre de la zona' });
                }

                if (resultNombreZona.length === 0) {
                    return res.status(400).json({ error: 'Zona no encontrada' });
                }

                const nombreZona = resultNombreZona[0].nombreZona;

                // Devolver respuesta de éxito con el nombre de la zona
                res.status(201).json({ message: 'Cliente creado con éxito', nombreZona });
            });
        });
    });
};



module.exports = {
    getAllClientes,
    addCliente
};
