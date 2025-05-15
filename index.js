const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Cargar variables de entorno
dotenv.config();

// Función para parsear la URL y preparar la configuración de conexión
const parseDatabaseUrl = (url) => {
    const regex = /mysql:\/\/(.*?):(.*?)@(.*?):(.*?)\/(.*?)\?ssl-mode=REQUIRED/;
    const match = url.match(regex);

    if (!match) throw new Error('Invalid DATABASE_URL format.');

    return {
        user: match[1],
        password: match[2],
        host: match[3],
        port: parseInt(match[4]),
        database: match[5],
        ssl: {
            ca: fs.readFileSync(path.join(__dirname, 'certs', 'ca.pem')),
            rejectUnauthorized: true
        }
    };
};

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);

// Ruta de prueba HTML
app.get('/test', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><title>Test Page</title></head>
        <body><h1>This is a Test HTML Page</h1><p>Welcome to the test route!</p></body>
        </html>
    `);
});

// Ruta para obtener los registros de la tabla Persons
app.get('/persons', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM Persons');
        await connection.end();

        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database connection failed.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
