const express = require('express');
const app = express();
const port = 3000;

// Ruta básica /test que devuelve un HTML de prueba
app.get('/test', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Test Page</title>
        </head>
        <body>
            <h1>This is a Test HTML Page</h1>
            <p>Welcome to the test route!</p>
        </body>
        </html>
    `);
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
