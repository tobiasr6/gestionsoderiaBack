const pool = require('../config/db'); // Importa el pool de conexiones

const getAllClientes = async (req, res) => {
    const query = `
        SELECT 
            c.idCliente AS id,
            c.nombre,
            c.direccion,
            c.telefono,
            c.observaciones,
            c.estado,
            z.nombreZona AS nombreZona,
            b.idBarrio AS idBarrio,
            b.nombreBarrio AS nombreBarrio,
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
        JOIN 
            barrio b ON c.idBarrio = b.idBarrio
        GROUP BY 
            c.idCliente;
    `;

    try {
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los clientes:', err);
        return res.status(500).json({ error: 'Error al obtener los clientes' });
    }
};

const addCliente = async (req, res) => {
    const { nombre, direccion, idBarrio, telefono, observaciones, pedidos, diasRecorrido } = req.body;

    // Obtener la zona correspondiente al barrio
    const queryZona = `SELECT idZona FROM barrio WHERE idBarrio = ?;`;

    try {
        const [resultZona] = await pool.query(queryZona, [idBarrio]);

        if (resultZona.length === 0) {
            return res.status(400).json({ error: 'Barrio no encontrado o sin zona asignada' });
        }

        const idZona = resultZona[0].idZona;

        // Insertar cliente en la tabla cliente con el barrio y zona correspondientes
        const queryCliente = `
            INSERT INTO cliente (nombre, direccion, idBarrio, idZona, telefono, observaciones) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [resultCliente] = await pool.query(queryCliente, [nombre, direccion, idBarrio, idZona, telefono, observaciones]);
        const idCliente = resultCliente.insertId;  // Obtenemos el ID del cliente recién insertado

        // Insertar pedidos en la tabla pedidosinter
        const queryPedido = `
            INSERT INTO pedidosinter (idCliente, cantidad, idProducto) 
            VALUES (?, ?, ?)
        `;

        if (Array.isArray(pedidos)) {
            await Promise.all(pedidos.map(async (pedido) => {
                await pool.query(queryPedido, [idCliente, pedido.cantidad, pedido.producto]);
            }));
        }

        // Insertar días de recorrido en la tabla clienteDia
        const queryDiaRecorrido = `
            INSERT INTO clienteDia (idCliente, idDia) 
            VALUES (?, ?)
        `;

        if (Array.isArray(diasRecorrido)) {
            await Promise.all(diasRecorrido.map(async (diaRecorrido) => {
                await pool.query(queryDiaRecorrido, [idCliente, diaRecorrido.dia]);
            }));
        }

        // Devolver respuesta de éxito
        res.status(201).json({ message: 'Cliente creado con éxito', idCliente });
    } catch (err) {
        console.error('Error al agregar el cliente:', err);
        return res.status(500).json({ error: 'Error al agregar el cliente' });
    }
};

const deleteCliente = async (req, res) => {
    const { idCliente } = req.params;

    try {
        // Primero eliminar los registros relacionados con pedidos y días de recorrido
        const queryDeletePedidos = `DELETE FROM pedidosinter WHERE idCliente = ?;`;
        await pool.query(queryDeletePedidos, [idCliente]);

        const queryDeleteDias = `DELETE FROM clienteDia WHERE idCliente = ?;`;
        await pool.query(queryDeleteDias, [idCliente]);

        // Luego eliminar el cliente
        const queryDeleteCliente = `DELETE FROM cliente WHERE idCliente = ?;`;
        await pool.query(queryDeleteCliente, [idCliente]);

        res.status(200).json({ message: 'Cliente eliminado con éxito' });
    } catch (err) {
        console.error('Error al eliminar el cliente:', err);
        return res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
};

const editCliente = async (req, res) => {
    const { idCliente, nombre, direccion, idBarrio, telefono, observaciones, pedidos, diasRecorrido } = req.body;

    // Verificar que idCliente está definido
    if (!idCliente) {
        return res.status(400).json({ error: 'idCliente es requerido' });
    }

    // Obtener la zona y el nombre del barrio correspondiente
    const queryBarrioZona = `
        SELECT 
            b.nombreBarrio, 
            z.idZona 
        FROM 
            barrio b 
        JOIN 
            zona z ON b.idZona = z.idZona 
        WHERE 
            b.idBarrio = ?;
    `;

    try {
        const [resultBarrioZona] = await pool.query(queryBarrioZona, [idBarrio]);

        if (resultBarrioZona.length === 0) {
            return res.status(400).json({ error: 'Barrio no encontrado o sin zona asignada' });
        }

        const { nombreBarrio, idZona } = resultBarrioZona[0];

        // Verificar que el cliente existe
        const queryClienteExist = `SELECT idCliente FROM cliente WHERE idCliente = ?`;
        const [clienteExist] = await pool.query(queryClienteExist, [idCliente]);

        if (clienteExist.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Actualizar cliente en la tabla cliente
        const queryCliente = `
            UPDATE cliente SET
                nombre = ?, direccion = ?, idBarrio = ?, idZona = ?, telefono = ?, observaciones = ?
            WHERE idCliente = ?
        `;
        await pool.query(queryCliente, [nombre, direccion, idBarrio, idZona, telefono, observaciones, idCliente]);

        // Actualizar pedidos en la tabla pedidosinter
        const queryPedidoDelete = `DELETE FROM pedidosinter WHERE idCliente = ?`;
        await pool.query(queryPedidoDelete, [idCliente]); // Eliminar pedidos existentes antes de agregar nuevos

        const queryPedidoInsert = `
            INSERT INTO pedidosinter (idCliente, cantidad, idProducto) 
            VALUES (?, ?, ?)
        `;
        if (Array.isArray(pedidos)) {
            await Promise.all(pedidos.map(async (pedido) => {
                await pool.query(queryPedidoInsert, [idCliente, pedido.cantidad, pedido.producto]);
            }));
        }

        // Actualizar días de recorrido en la tabla clienteDia
        const queryDiaDelete = `DELETE FROM clienteDia WHERE idCliente = ?`;
        await pool.query(queryDiaDelete, [idCliente]); // Eliminar días existentes antes de agregar nuevos

        const queryDiaInsert = `
            INSERT INTO clienteDia (idCliente, idDia) 
            VALUES (?, ?)
        `;
        if (Array.isArray(diasRecorrido)) {
            await Promise.all(diasRecorrido.map(async (diaRecorrido) => {
                await pool.query(queryDiaInsert, [idCliente, diaRecorrido.dia]);
            }));
        }

        // Devolver respuesta con el nombre del barrio y éxito
        res.status(200).json({ message: 'Cliente actualizado con éxito', nombreBarrio });
    } catch (err) {
        console.error('Error al editar el cliente:', err);
        return res.status(500).json({ error: 'Error al editar el cliente' });
    }
};


const getClienteById = async (req, res) => {
    const { idCliente } = req.params; // Obtenemos el idCliente de los parámetros de la URL

    const query = `
        SELECT 
            c.idCliente AS id,
            c.nombre,
            c.direccion,
            c.telefono,
            c.observaciones,
            z.nombreZona AS nombreZona,
            b.idBarrio AS idBarrio,
            b.nombreBarrio AS nombreBarrio,
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
        JOIN 
            barrio b ON c.idBarrio = b.idBarrio
        WHERE 
            c.idCliente = ?;  -- Filtro por el idCliente pasado
    `;

    try {
        const [results] = await pool.query(query, [idCliente]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(results[0]);  // Devolvemos solo el primer (y único) resultado
    } catch (err) {
        console.error('Error al obtener el cliente:', err);
        return res.status(500).json({ error: 'Error al obtener el cliente' });
    }
};

const updateEstadoCliente = async (req, res) => {
    const { idCliente } = req.params;
    const { estado } = req.body; // Estado a actualizar (ej. "activo" o "inactivo")

    try {
        // Actualizar solo el estado del cliente en la tabla cliente
        const query = `UPDATE cliente SET estado = ? WHERE idCliente = ?`;
        await pool.query(query, [estado, idCliente]);

        res.status(200).json({ message: `Estado del cliente actualizado a ${estado}` });
    } catch (err) {
        console.error('Error al actualizar el estado del cliente:', err);
        return res.status(500).json({ error: 'Error al actualizar el estado del cliente' });
    }
};

module.exports = {
    getAllClientes,
    addCliente,
    deleteCliente,
    editCliente,
    getClienteById,
    updateEstadoCliente
};