import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Configuración inteligente:
// Si existe DATABASE_URL (Nube), usa eso.
// Si no, usa los datos sueltos (Tu PC).
const config = process.env.DATABASE_URL ?
    {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Obligatorio para Neon/Render
    } :
    {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    };

const pool = new pg.Pool(config);

export default pool;