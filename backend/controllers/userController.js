import db from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerClient = async (req, res) => {
    const { email, contraseña, nombre, apellidos, direccion } = req.body;
    const connection = await db.getConnection(); // Obtenemos conexión para la transacción

    try {
        await connection.beginTransaction();

        // 1. Insertar en la tabla Usuario
        const hashedPw = await bcrypt.hash(contraseña, 10);
        const [userResult] = await connection.query(
            "INSERT INTO Usuario (email, contraseña, rol) VALUES (?, ?, 'cliente')",
            [email, hashedPw]
        );

        const newUserId = userResult.insertId;

        // 2. Insertar en la tabla Cliente usando el ID recién creado
        await connection.query(
            "INSERT INTO Cliente (id_usuario, nombre, apellidos, direccion) VALUES (?, ?, ?, ?, ?)",
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
    const { email, contraseña } = req.body;

    try {
        // 1. Buscar al usuario por email
        const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [email]);

        if (rows.length === 0) return res.status(401).json({ error: "Credenciales incorrectas" });

        const user = rows[0];

        // 2. Verificar contraseña
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) return res.status(401).json({ error: "Credenciales incorrectas" });

        // 3. Generar el Token
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error("ERROR CRÍTICO: No se ha definido JWT_SECRET en el archivo .env");
            return res.status(500).json({ error: "Configuración del servidor incompleta" });
        }

        const token = jwt.sign(
            { id: user.id_usuario, rol: user.rol },
            secret,
            { expiresIn: '8h' }
        );

        res.json({ message: "Login exitoso", token, rol: user.rol });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" + error });
    }
};

export const getClientProfile = async (req, res) => {
    // Ya no usamos req.params.id (URL)
    // Usamos req.user.id que el middleware de auth sacó del Token
    const userIdFromToken = req.user.id;

    try {
        const [rows] = await db.query(`
      SELECT u.email, c.nombre, c.apellidos, c.direccion
      FROM Usuario u
      INNER JOIN Cliente c ON u.id_usuario = c.id_usuario
      WHERE u.id_usuario = ?
    `, [userIdFromToken]);

        if (rows.length === 0) return res.status(404).json({ error: "Perfil no encontrado" });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};