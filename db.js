import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'default',
    host: 'ep-still-dream-a4m64z7d-pooler.us-east-1.aws.neon.tech',
    database: 'scanma-database',
    password: 'RoEg2cd0sWzD',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Si es necesario en entornos seguros
      },
});

pool.connect(); // Nos conectamos a la base de datos

export { pool };