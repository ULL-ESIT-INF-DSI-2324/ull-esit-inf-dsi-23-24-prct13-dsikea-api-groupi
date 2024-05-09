import { CursorStreamOptions } from 'mongodb';
import { Document, connect, model, Schema } from 'mongoose';

// Esquema de la base de datos de proveedores
connect('mongodb://127.0.0.1:27017/providers').then(() => {
  console.log('Conectado a la base de datos');
}).catch(() => {
  console.log('Algo fallo al intentar conectarse a la base de datos de proveedores');
});

/**
 * @brief Esquema de la base de datos de proveedores
 * id: Identificador del proveedor
 * nombre: Nombre del proveedor
 * correo: Correo del proveedor
 * direccion: Dirección del proveedor
 */
export interface ProviderInterface extends Document  {
    cif: string,
    nombre: string,
    correo: string,
    direccion: string,
}

/**
 * @brief Esquema de la colección de proveedores
 */
export const ProviderSchema: Schema = new Schema <ProviderInterface>({

});



