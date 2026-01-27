import db from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerClient = async (req, res) => {
    const { email, password, nombre, apellidos, direccion } = req.body;
    const connection = await db.getConnection(); // Obtenemos conexión para la transacción

    try {
        await connection.beginTransaction();

        // 1. Insertar en la tabla Usuario
        const hashedPw = await bcrypt.hash(password, 10);
        const [userResult] = await connection.query(
            "INSERT INTO Usuario (email, contraseña, rol) VALUES (?, ?, 'cliente')",
            [email, hashedPw]
        );

        const newUserId = userResult.insertId;

        // 2. Insertar en la tabla Cliente usando el ID recién creado
        await connection.query(
            "INSERT INTO Cliente (id_usuario, nombre, apellidos, direccion) VALUES (?, ?, ?, ?)",
            [newUserId, nombre, apellidos, direccion]
        );

        await connection.commit();
        res.status(201).json({ message: "Cliente registrado con éxito", id: newUserId });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al registrar el cliente" });
    } finally {
        connection.release();
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar al usuario por email
        const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [email]);

        if (rows.length === 0) return res.status(401).json({ error: "Credenciales incorrectas" });

        const user = rows[0];

        // 2. Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.contraseña);
        if (!validPassword) return res.status(401).json({ error: "Credenciales incorrectas" });

        // 3. Generar el Token
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error("ERROR CRÍTICO: No se ha definido JWT_SECRET en el archivo .env");
            return res.status(500).json({ error: "Configuración del servidor incompleta" });
        }

        const token = jwt.sign(
    { 
        id: user.id || user.id_usuario,
        rol: user.rol 
    },
    secret,
    { expiresIn: '8h' }
);

        res.json({ message: "Login exitoso", token, rol: user.rol });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" + error });
    }
};

export const getClientProfile = async (req, res) => {
    // Si llega aquí, es porque verifyToken ya validó que req.user existe
    try {
        const [rows] = await db.query(`
            SELECT u.email, u.rol, c.nombre, c.apellidos, c.direccion
            FROM Usuario u
            INNER JOIN Cliente c ON u.id_usuario = c.id_usuario
            WHERE u.id_usuario = ?
        `, [req.user.id]);

        if (rows.length === 0) return res.status(404).json({ error: "Perfil no encontrado" });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};

export const updateClientProfile = async (req, res) => {
    // El middleware validateSchema ya limpió req.body con Zod
    const { nombre, apellidos, direccion } = req.body;
    const userId = req.user.id;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
    }

    try {
        // Construimos la query dinámicamente o actualizamos todo (Zod garantiza que lo que llegue es válido)
        const query = `
      UPDATE Cliente 
      SET nombre = COALESCE(?, nombre), 
          apellidos = COALESCE(?, apellidos), 
          direccion = COALESCE(?, direccion)
      WHERE id_usuario = ?
    `;

        const [result] = await db.query(query, [nombre, apellidos, direccion, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No se pudo encontrar el perfil para actualizar" });
        }

        res.json({ message: "Perfil actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el perfil" });
    }
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        // 1. Obtener la contraseña actual de la DB
        const [rows] = await db.query("SELECT contraseña FROM Usuario WHERE id_usuario = ?", [userId]);
        const user = rows[0];

        // 2. Comparar con la que envió el usuario
        const isMatch = await bcrypt.compare(currentPassword, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ error: "La contraseña actual es incorrecta" });
        }

        // 3. Hashear la nueva y actualizar
        const hashedPw = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE Usuario SET contraseña = ? WHERE id_usuario = ?", [hashedPw, userId]);

        res.json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al cambiar la contraseña" });
    }
};