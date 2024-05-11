// server.ts
import express from 'express';
import './db/mongoose.js';

import { customerRouter } from './routers/customers_routers.js';
import { providerRouter } from './routers/provider_routers.js';
import { furnitureRouter } from './routers/furnitures_routers.js';

export const app = express();
const port = process.env.PORT || 3000;

// Rutas

app.use(providerRouter);
app.use(customerRouter);
app.use(furnitureRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
