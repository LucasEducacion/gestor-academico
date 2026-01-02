import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// 1. Configuración inicial
const app = express();
const port = process.env.PORT || 3000; // Lee el puerto del .env
const SECRET_KEY = process.env.JWT_SECRET;

// 2. Middlewares (para que el servidor entienda JSON y acepte conexiones externas)
app.use(cors());
app.use(express.json());

// 3. Una ruta de prueba
// Cuando alguien entre a la dirección base "/", el servidor responderá esto:
app.get('/', (req, res) => {
    res.send('¡Hola! El servidor del Gestor Académico está funcionando 🚀');
});

// Prueba de base de datos
app.get('/ping', async(req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Pong! 🏓', time: result.rows[0].now });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error conectando a la BD' });
    }
});

// Ruta para obtener las materias del usuario (Por ahora simulamos que es el Usuario ID 1)
app.get('/materias', async(req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Acceso denegado');

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        const usuario_id = verified.id;

        // 1. Obtener TODAS las materias con su estado actual (si existe)
        const materiasQuery = `
      SELECT 
        m.id, 
        m.nombre as materia, 
        c.nombre as anio, 
        c.color, 
        c.id as categoria_id,
        nu.nota, 
        nu.condicion
      FROM materias m
      JOIN categorias c ON m.categoria_id = c.id
      LEFT JOIN notas_usuarios nu ON nu.materia_id = m.id AND nu.usuario_id = $1
      ORDER BY c.id ASC, m.id ASC; -- ORDEN ARREGLADO
    `;
        const materiasResult = await pool.query(materiasQuery, [usuario_id]);
        const materias = materiasResult.rows;

        // 2. Obtener TODAS las reglas de correlatividades
        const reglasQuery = 'SELECT * FROM correlatividades';
        const reglasResult = await pool.query(reglasQuery);
        const reglas = reglasResult.rows;

        // 3. Crear un Mapa de las materias aprobadas por el usuario para consulta rápida
        // Set contiene los IDs de las materias que el usuario ya aprobó
        const aprobadas = new Set(
            materias.filter(m => m.condicion === 'Aprobada' || m.condicion === 'Cursada').map(m => m.id)
        );

        // 4. Calcular Disponibilidad Automáticamente
        const materiasProcesadas = materias.map(materia => {
            // Si ya está aprobada o cursada, el estado es su condición
            if (materia.condicion === 'Aprobada') return {...materia, disponibilidad: 'Aprobada' };

            // Buscamos qué materias necesita esta materia para cursarse
            const prerequisitos = reglas
                .filter(r => r.materia_id === materia.id)
                .map(r => r.correlativa_id);

            // Verificamos si tiene todos los prerequisitos en el Set de aprobadas
            const cumpleRequisitos = prerequisitos.every(prereqId => aprobadas.has(prereqId));

            // Si no tiene prerequisitos (1er año) o los cumple todos -> Disponible
            let estado = 'No Disponible';
            if (prerequisitos.length === 0 || cumpleRequisitos) {
                estado = 'Disponible';
            }

            // Opcional: Si ya la está cursando
            if (materia.condicion === 'Cursada') estado = 'Cursando';

            return {...materia, disponibilidad: estado };
        });

        res.json(materiasProcesadas);

    } catch (error) {
        console.error(error);
        res.status(400).send('Error');
    }
});

app.post('/registro', async(req, res) => {
    const { nombre, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)', [nombre, email, hashedPassword]
        );
        res.send('Usuario creado exitosamente');
    } catch (error) {
        res.status(500).send('Error creando usuario');
    }
})

app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar usuario
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

        const user = result.rows[0];

        // 2. Comparar contraseñas
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

        // 3. Crear Token
        const token = jwt.sign({ id: user.id, nombre: user.nombre }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, nombre: user.nombre });
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para APROBAR MASIVAMENTE un año completo
app.post('/materias/aprobar-anio', async(req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Sin autorización');

    const { categoria_id } = req.body; // Recibimos el ID del año (1, 2, 3...)
    console.log("Intentando aprobar año ID:", categoria_id);

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        const usuario_id = verified.id;

        // Esta consulta es "magia pura":
        // 1. Selecciona todas las materias de ese año.
        // 2. Intenta insertarles un 7 y "Aprobada".
        // 3. Si ya existían, actualiza la condición a "Aprobada" (mantiene la nota vieja si era mayor, o pone 7).
        const query = `
      INSERT INTO notas_usuarios (usuario_id, materia_id, nota, condicion, disponibilidad)
      SELECT $1, id, 7, 'Aprobada', 'Disponible'
      FROM materias
      WHERE categoria_id = $2
      ON CONFLICT (usuario_id, materia_id) 
      DO UPDATE SET 
        condicion = 'Aprobada',
        nota = CASE WHEN notas_usuarios.nota IS NULL THEN 7 ELSE notas_usuarios.nota END;
    `;

        await pool.query(query, [usuario_id, categoria_id]);
        console.log("¡Éxito en la base de datos!"); // <--- LOG 2
        res.send('Año aprobado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al aprobar el año');
    }
});

// Ruta para Guardar/Actualizar una nota (Upsert)
app.post('/materias/:id', async(req, res) => {
    // 1. Validar token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Sin autorización');

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        const usuario_id = verified.id;
        const materia_id = req.params.id;
        const { nota, condicion, disponibilidad } = req.body;

        // 2. Guardar o Actualizar la materia actual
        const checkQuery = 'SELECT * FROM notas_usuarios WHERE usuario_id = $1 AND materia_id = $2';
        const checkResult = await pool.query(checkQuery, [usuario_id, materia_id]);

        if (checkResult.rows.length > 0) {
            await pool.query(
                `UPDATE notas_usuarios 
                 SET nota = $1, condicion = $2, disponibilidad = $3 
                 WHERE usuario_id = $4 AND materia_id = $5`, [nota, condicion, disponibilidad, usuario_id, materia_id]
            );
        } else {
            await pool.query(
                `INSERT INTO notas_usuarios (usuario_id, materia_id, nota, condicion, disponibilidad) 
                 VALUES ($1, $2, $3, $4, $5)`, [usuario_id, materia_id, nota, condicion, disponibilidad]
            );
        }

        // --- 3. PASO NUEVO: MAGIA DE CORRELATIVIDADES ---
        // Esta consulta desbloquea automáticamente las materias siguientes
        // si sus correlativas están 'Aprobada' O 'Cursada'.
        await pool.query(`
            UPDATE notas_usuarios n_destino
            SET disponibilidad = 'Disponible'
            WHERE usuario_id = $1
            AND disponibilidad = 'No Disponible' -- Solo revisamos las bloqueadas
            AND NOT EXISTS (
                -- Buscamos si existe alguna correlativa que NO cumpla los requisitos
                SELECT 1 
                FROM correlatividades c
                LEFT JOIN notas_usuarios n_requisito 
                    ON c.correlativa_id = n_requisito.materia_id 
                    AND n_requisito.usuario_id = $1
                WHERE c.materia_id = n_destino.materia_id
                AND (
                    n_requisito.condicion IS NULL OR 
                    (n_requisito.condicion != 'Aprobada' AND n_requisito.condicion != 'Cursada')
                )
            )
        `, [usuario_id]);
        // ------------------------------------------------

        res.send('Guardado y correlatividades actualizadas');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar');
    }
});

// Ruta para BORRAR TODO el progreso del usuario (Reset)
app.delete('/materias/reset', async(req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Sin autorización');

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        const usuario_id = verified.id;

        // Borramos todas las entradas en la tabla de notas para este usuario
        await pool.query('DELETE FROM notas_usuarios WHERE usuario_id = $1', [usuario_id]);

        res.send('Progreso eliminado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al resetear');
    }
});



// 4. Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});