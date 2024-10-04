const db = require('../config/db'); 

const getAllClientes = (req, res) => {
    const query = `
        SELECT 
            c.idCliente AS id,
            c.nombre,
            c.direccion,
            z.nombreZona AS nombreZona,
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
            zona z ON c.idZona = z.idZona
        GROUP BY 
            c.idCliente;
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
    const queryZona = `SELECT idZona FROM barrio WHERE idBarrio = ?;`;

    db.query(queryZona, [idBarrio], (err, resultZona) => {
        if (err) {
            console.error('Error al obtener la zona del barrio:', err);
            return res.status(500).json({ error: 'Error al obtener la zona del barrio' });
        }

        if (resultZona.length === 0) {
            return res.status(400).json({ error: 'Barrio no encontrado o sin zona asignada' });
        }

        const idZona = resultZona[0].idZona;

        // Insertar cliente en la tabla cliente con el barrio y zona correspondientes
        const queryCliente = `
            INSERT INTO cliente (nombre, direccion, idBarrio, idZona, telefono, observaciones) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(queryCliente, [nombre, direccion, idBarrio, idZona, telefono, observaciones], (err, resultCliente) => {
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

            // Asegúrate de que 'pedidos' sea un array y esté definido
            if (Array.isArray(pedidos)) {
                pedidos.forEach((pedido) => {
                    db.query(queryPedido, [idCliente, pedido.cantidad, pedido.producto], (err) => {
                        if (err) {
                            console.error('Error al insertar el pedido:', err);
                            return res.status(500).json({ error: 'Error al insertar el pedido' });
                        }
                    });
                });
            }

            // Insertar días de recorrido en la tabla clienteDia
            const queryDiaRecorrido = `
                INSERT INTO clienteDia (idCliente, idDia) 
                VALUES (?, ?)
            `;

            // Asegúrate de que 'diasRecorrido' sea un array y esté definido
            if (Array.isArray(diasRecorrido)) {
                diasRecorrido.forEach((diaRecorrido) => {
                    db.query(queryDiaRecorrido, [idCliente, diaRecorrido.dia], (err) => {
                        if (err) {
                            console.error('Error al insertar el día de recorrido:', err);
                            return res.status(500).json({ error: 'Error al insertar el día de recorrido' });
                        }
                    });
                });
            }

            // Devolver respuesta de éxito
            res.status(201).json({ message: 'Cliente creado con éxito', idCliente });
        });
    });
};

const deleteCliente = (req, res) => {
    const { idCliente } = req.params;

    //Primero eliminar los registros relacionados con pedidos y dias recorrido
    const queryDeletePedidos = `DELETE FROM pedidosinter WHERE idCliente = ?;`;
    const queryDeleteDias = `DELETE FROM clienteDia WHERE idCliente = ?;`;

    db.query(queryDeletePedidos, [idCliente], (err) => {
        if (err) {
            console.error('Error al eliminar los pedidos:', err);
            return res.status(500).json({ error: 'Error al eliminar los pedidos' });
        }

        db.query(queryDeleteDias, [idCliente], (err) => {
            if (err) {
                console.error('Error al eliminar los días de recorrido:', err);
                return res.status(500).json({ error: 'Error al eliminar los días de recorrido' });
            }

            // Luego eliminar el cliente
            const queryDeleteCliente = `DELETE FROM cliente WHERE idCliente = ?;`;

            db.query(queryDeleteCliente, [idCliente], (err) => {
                if (err) {
                    console.error('Error al eliminar el cliente:', err);
                    return res.status(500).json({ error: 'Error al eliminar el cliente' });
                }

                res.status(200).json({ message: 'Cliente eliminado con éxito' });
            });
        });
    });
};

module.exports = {
    getAllClientes,
    addCliente,
    deleteCliente
};
