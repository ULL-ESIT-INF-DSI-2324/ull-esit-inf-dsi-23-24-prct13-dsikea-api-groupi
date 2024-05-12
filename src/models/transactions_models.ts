import { Document, model, Schema } from 'mongoose';
import { ClienteSchema } from './customers_models.js';
import { ProviderSchema } from './providers_models.js';
import { MuebleSchema } from './furnitures_models.js';

/**
 * @brief Tupla que contiene un mueble y la cantidad de ese mueble
 * mueble: Mueble que se va a comprar o vender
 * cantidad: Cantidad de muebles que se van a comprar o vender
 */
export interface TuplaMueble {
  _id: typeof MuebleSchema;
  cantidad: number;
}

/**
 * @brief Esquema de la base de datos de transacciones
 * tipo: Tipo de transacción (Compra o Venta)
 * muebles: Lista de tuplas que contienen un mueble y la cantidad de ese mueble
 * proveedor: Proveedor que vende los muebles
 * cliente: Cliente que compra los muebles
 * fecha: Fecha de la transacción
 * precio: Precio total de la transacción
 */
export interface TransactionInterface extends Document {
  tipo: 'Compra' | 'Venta';
  muebles: TuplaMueble[];
  proveedor?: typeof ProviderSchema; // referencia a la colección de proveedores
  cliente?: typeof ClienteSchema; // referencia a la colección de clientes
  fecha: Date;
  precio: number;
}

/**
 * @brief Esquema de la colección de transacciones
 */
export const TransactionSchema = new Schema<TransactionInterface>({
  tipo: {
    type: String,
    enum: ['Compra', 'Venta'],
    required: true,
  },
  muebles: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Mueble',
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    validate: {
      validator: async function (value: string) {
        if(value) {
          const cliente = await model('Cliente').findById(value);
          return cliente !== null;
        }
        return true;
      },
      message: 'El cliente no existe',
    }
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: 'Provider',
    validate: {
      validator: async function (value: string) {
        if (value) {
          const proveedor = await model('Provider').findById(value);
          return proveedor !== null;
        }
        return true; // Si no se especifica proveedor, no se valida
      },
      message: 'El proveedor especificado no existe',
    },
  },
  fecha: {
    type: Date,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
});

// Exportar el modelo de transacciones
export const Transaction = model<TransactionInterface>('Transaction', TransactionSchema);
