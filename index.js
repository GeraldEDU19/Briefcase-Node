const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const port = 3000;

// Ruta que devuelve un HTML con la tabla de personas
app.get('/persons', async (req, res) => {
    try {
        const persons = await prisma.persons.findMany();

        // Generar las filas de la tabla
        const tableRows = persons.map(person => `
            <tr>
                <td>${person.PersonID}</td>
                <td>${person.FirstName}</td>
                <td>${person.LastName}</td>
                <td>${person.Address}</td>
                <td>${person.City}</td>
            </tr>
        `).join('');

        // Responder con HTML completo
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Persons List</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Persons List</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>City</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('<h1>Database connection failed.</h1>');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
