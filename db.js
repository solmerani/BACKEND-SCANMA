import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    user: 'default',
    host: 'ep-still-dream-a4m64z7d-pooler.us-east-1.aws.neon.tech',
    database: 'scanma-database',
    password: 'RoEg2cd0sWzD',
    port: 5432,
    ssl: true,
});

client.connect(); // Nos conectamos a la base de datos

export { client };