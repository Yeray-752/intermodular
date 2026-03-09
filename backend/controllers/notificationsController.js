import db from "../db.js";

const titulos = {
    cliente: {
        compra: "Compra Realizada",
        cita: "Cita Programada",
        cita_cancelada: "Cita Cancelada",
        cita_estado: "Estado de Cita Actualizado",
        valoración: "Valoración Enviada",
        valoracion_borrada: "Valoración Eliminada",
    },
    admin: {
        nueva_venta: "Nueva Venta Confirmada",
        producto_creado: "Nuevo Producto Agregado",
        producto_actualizado: "Producto Modificado",
        producto_eliminado: "Producto Eliminado",
        stock_nulo: "Stock Agotado",
        stock_actualizado: "Stock Actualizado",
        servicio_nuevo: "Nuevo Servicio Agregado",
        servicio_actualizado: "Datos de Servicio Actualizados",
        servicio_eliminado: "Servicio Eliminado del Sistema",
        cita_estado_admin: "Estado de Cita Actualizado",
        cita_cancelada_admin: "Cita Cancelada"
    }
};

const plantillas = {
    cliente: {
        compra: (data) => `¡Gracias! Tu pedido #${data.id_pedido} con ${data.cantidad_articulos} artículos 
        por un total de ${data.total}€ se ha procesado correctamente.`,

        cita: (data) => `Cita programada para el día ${data.fecha}.`,
        cita_cancelada: (data) => `Tu cita del ${data.fecha} ha sido cancelada con éxito.`,
        cita_estado: (data) => `Tu cita del ${data.fecha} ahora está: ${data.estado}.`,

        valoracion_borrada: (data) => `Tu reseña sobre el producto ha sido eliminada correctamente.`,
        valoración: (data) => `¡Gracias! Tu opinión sobre "${data.producto}" se ha guardado correctamente.`,
    },
    admin: {
        nueva_venta: (data) => `Nueva venta recibida: Pedido #${data.id_pedido} por un total de ${data.total}€.`,

        producto_creado: (data) => `Se ha añadido el producto: ${data.nombre}. Stock inicial: ${data.stock}.`,
        producto_actualizado: (data) => `Producto "${data.nombre_original}" actualizado. Cambios: ${data.cambios.join(', ')}.`,
        producto_eliminado: (data) => `Eliminado: ${data.nombre}. (Precio: ${data.precio}€, Stock al borrar: ${data.stock}).`,
        stock_nulo: (data) => `El stock de ${data.producto} ha llegado a cero.`,
        stock_actualizado: (data) => `El stock de ${data.producto} ha sido actualizado a ${data.stock}.`,

        servicio_nuevo: (data) => `Se ha agregado un nuevo servicio: ${data.servicio}.`,

        //los servicios pueden tener varios datos cambiados, así que se le pasan todos los cambios en un array para mostrarlo en la notificación
        servicio_actualizado: (data) => { return `Se ha modificado el servicio "${data.servicio_original}". Cambios realizados: ${data.cambios.join(', ')}.`; },
        servicio_eliminado: (data) => `Se ha eliminado el servicio "${data.nombre}". Datos al momento del borrado - Precio: ${data.precio}€, Duración: ${data.duracion}min.`,
        cita_estado_admin: (data) => `La cita del usuario ${data.usuario} ha sido actualizada al estado "${data.estado}".`,
        cita_cancelada_admin: (data) => `La cita del ${data.fecha} con el usuario ${data.usuario} ha sido cancelada.` //Cuando el cliente o admin cancela tambien salta esto al admin
    }
};

export const getNotificationsByID = async (req, res) => {
    try {
        // Obtenemos notificaciones del usuario logueado, las más recientes primero
        const [rows] = await db.execute(
            'SELECT * FROM Notificaciones WHERE id_usuario = ? ORDER BY creado_en DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener notificaciones" });
    }
};

export const getNotificationsAdmin = async (req, res) => {
    try {
        // Usado para obtener las notificaciones que les sirven a los admins
        const [rows] = await db.execute(
            'SELECT * FROM Notificaciones WHERE rol = admin ORDER BY creado_en DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener notificaciones de admin" });
    }
};

export const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        // Solo el dueño de la notificación puede marcarla como leída
        const [result] = await db.execute(
            'UPDATE Notificaciones SET leido = TRUE WHERE id = ? AND id_usuario = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }

        res.json({ message: "Notificación leída" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar notificación" });
    }
};

export const createNotification = async (id_usuario, tipo, rol, data = {}) => {
    try {
        const titulo = titulos[rol][tipo];
        const mensaje = plantillas[rol][tipo](data);

        await db.execute(
            'INSERT INTO Notificaciones (id_usuario, titulo, mensaje, rol) VALUES (?, ?, ?, ?)',
            [id_usuario, titulo, mensaje, rol]
        );
    } catch (error) {
        console.error("Error al crear notificación:", error);
        throw error;
    }
};