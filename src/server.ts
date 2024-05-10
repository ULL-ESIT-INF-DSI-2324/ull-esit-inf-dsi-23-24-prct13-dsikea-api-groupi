// server.ts
import express from 'express';
import './db/mongoose.js';

//import customersRoutes from './routes/customersroutes.js';
import {providerRouter} from './routers/provider_routers.js';
//import furnituresRoutes from './routes/furnituresroutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Rutas
// app.use('/customers', customersRoutes);
app.use(providerRouter);
// app.use('/furnitures', furnituresRoutes);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});