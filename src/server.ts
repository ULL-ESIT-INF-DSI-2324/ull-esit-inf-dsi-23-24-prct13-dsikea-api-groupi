// server.ts
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
//import customersRoutes from './routes/customersroutes.js';
//import providersroutes from './routes/providersroutes.js';
//import furnituresRoutes from './routes/furnituresroutes.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/dsikea', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rutas
// app.use('/customers', customersRoutes);
// app.use('/providers', providersRoutes);
// app.use('/furnitures', furnituresRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
