import express from 'express';
import bodyParser from 'body-parser';
import clientesRoutes from './routes/clientesRoutes.js';
import administradoresRoutes from './routes/administradoresRoutes.js';
import empleadosRoutes from './routes/empleadosRoutes.js';

const app = express();

app.use(bodyParser.json());

app.use('/api/clientes', clientesRoutes);
app.use('/api/administradores', administradoresRoutes);
app.use('/api/empleados', empleadosRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});