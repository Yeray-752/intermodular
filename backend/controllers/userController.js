import db from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─────────────────────────────────────────────
// REGISTRO CLÁSICO (sin verificación por email)
// ─────────────────────────────────────────────
export const registerClient = async (req, res) => {
    const { email, password, nombre, apellidos, direccion, captchaToken } = req.body;

    const captchaRes = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captchaToken,
        })
    );
    if (!captchaRes.data.success) {
        return res.status(400).json({ error: "Captcha inválido" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const hashedPw = await bcrypt.hash(password, 10);
        const [userResult] = await connection.query(
            "INSERT INTO Usuario (email, contraseña, rol) VALUES (?, ?, 'cliente')",
            [email, hashedPw]
        );
        await connection.query(
            "INSERT INTO Cliente (id_usuario, nombre, apellidos, direccion) VALUES (?, ?, ?, ?)",
            [userResult.insertId, nombre, apellidos, direccion]
        );

        await connection.commit();

        // ← Generar token igual que en login
        const token = jwt.sign(
            { id: userResult.insertId, rol: 'cliente' },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(201).json({ message: "Cliente registrado con éxito", token, rol: 'cliente' });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al registrar el cliente" });
    } finally {
        connection.release();
    }
};

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
export const login = async (req, res) => {
    const { email, password, captchaToken } = req.body;

    try {
        const captchaRes = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captchaToken,
            })
        );

        if (!captchaRes.data.success) {
            return res.status(400).json({
                error: "Verificación de seguridad fallida",
                details: captchaRes.data['error-codes']
            });
        }

        const [rows] = await db.query("SELECT * FROM Usuario WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.contraseña);
        if (!validPassword) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ error: "Error de configuración en el servidor" });
        }

        const token = jwt.sign(
            { id: user.id_usuario || user.id, rol: user.rol },
            secret,
            { expiresIn: '8h' }
        );

        res.json({ message: "Login exitoso", token, rol: user.rol });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: "Hubo un error en el servidor al intentar iniciar sesión." });
    }
};

// ─────────────────────────────────────────────
// PERFIL
// ─────────────────────────────────────────────
export const getClientProfile = async (req, res) => {
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
    const { nombre, apellidos, direccion } = req.body;
    const userId = req.user.id;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
    }

    try {
        const [result] = await db.query(`
            UPDATE Cliente 
            SET nombre = COALESCE(?, nombre), 
                apellidos = COALESCE(?, apellidos), 
                direccion = COALESCE(?, direccion)
            WHERE id_usuario = ?
        `, [nombre, apellidos, direccion, userId]);

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
        const [rows] = await db.query("SELECT contraseña FROM Usuario WHERE id_usuario = ?", [userId]);
        const user = rows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ error: "La contraseña actual es incorrecta" });
        }

        const hashedPw = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE Usuario SET contraseña = ? WHERE id_usuario = ?", [hashedPw, userId]);

        res.json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al cambiar la contraseña" });
    }
};

// ─────────────────────────────────────────────
// GOOGLE LOGIN
// ─────────────────────────────────────────────
export const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    const connection = await db.getConnection();

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name, given_name, family_name } = ticket.getPayload();

        await connection.beginTransaction();

        let [rows] = await connection.query("SELECT * FROM Usuario WHERE email = ?", [email]);
        let user = rows[0];

        if (!user) {
            const [userRes] = await connection.query(
                "INSERT INTO Usuario (email, rol) VALUES (?, 'cliente')",
                [email]
            );
            const newId = userRes.insertId;

            await connection.query(
                "INSERT INTO Cliente (id_usuario, nombre, apellidos) VALUES (?, ?, ?)",
                [newId, given_name || name, family_name || '']
            );

            user = { id_usuario: newId, rol: 'cliente' };
        }

        await connection.commit();

        const token = jwt.sign(
            { id: user.id_usuario, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, rol: user.rol });

    } catch (e) {
        await connection.rollback();
        console.error("Error:", e);
        res.status(400).json({ error: "Fallo en la autenticación", detalle: e.message });
    } finally {
        connection.release();
    }
};