import express from 'express'
import { createPool } from 'mysql2/promise'

const app = express()

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    port: 3307,
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/db', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT NOW() as currentTime');
        res.json(result[0]);
    } catch (error) {
        console.error('Error al ejecutar la consulta SQL:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

app.get('/create-table', async (req, res) => {
    try {
        // Consulta SQL para crear una tabla llamada 'mi_tabla' con algunas columnas de ejemplo
        const createTableQuery = `
            CREATE TABLE mi_tabla (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255),
                edad INT
            )
        `;
        
        // Ejecutar la consulta para crear la tabla
        await pool.query(createTableQuery);

        res.json({ message: 'Tabla creada correctamente' });
    } catch (error) {
        console.error('Error al crear la tabla:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/get-users', async (req, res) => {
    try {
      
      await pool.query('USE alfredodb'); 
  
      const [rows] = await pool.query('SELECT * FROM usuarios');
      res.json(rows);
    } catch (error) {
      console.error('Error al ejecutar la consulta SELECT:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  

app.post('/add-user', async (req, res) => {
    try {
      
      await pool.query('INSERT INTO usuarios (id, nombre, edad) VALUES (?, ?, ?)', [1, 'Alfredo', 19]);
  
      res.json({ message: 'Usuario agregado correctamente' });
    } catch (error) {
      console.error('Error al insertar usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  


app.listen(3000, () => {
    console.log('Server on port', 3000)
})
