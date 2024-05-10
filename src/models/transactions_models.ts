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
  mueble: typeof MuebleSchema;
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
  proveedor?: typeof ProviderSchema;
  cliente?: typeof ClienteSchema;
  fecha: Date;
  precio: number;
}

export const TransactionSchema = new Schema<TransactionInterface>({
  tipo: {
    type: String,
    enum: ['Compra', 'Venta'],
    required: true,
  },
  muebles: [
    {
      mueble: {
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
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: 'Proveedor',
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
