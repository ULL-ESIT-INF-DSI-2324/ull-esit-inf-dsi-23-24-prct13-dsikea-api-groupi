import { Document, Schema, model } from 'mongoose';

/**
 * @brief Esquema de la base de datos de clientes
 * dni: DNI del cliente
 * nombre: Nombre del cliente
 * correo: Correo del cliente
 * contacto: Número de contacto del cliente
 */
export interface ClienteInterface extends Document {
  dni: string;
  nombre: string;
  correo: string;
  contacto: string;
}

/**
 * @brief Esquema de la colección de clientes
 */
export const ClienteSchema: Schema = new Schema<ClienteInterface>({
  dni: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El DNI del cliente no puede ser vacío.');
      }
      if (value.length !== 9) {
        throw new Error('El DNI del cliente debe tener 9 caracteres.');
      }
      if (!/^\d{8}[A-Z]$/.test(value)) {
        throw new Error('El DNI del cliente debe tener un formato válido: [8 dígitos][1 letra mayúscula].');
      }
    },
  },
  nombre: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre del cliente no puede ser vacío.');
      }
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre del cliente debe comenzar con mayúscula.');
      }
    },
  },
  correo: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El correo del cliente no puede ser vacío.');
      }
      if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        throw new Error('El correo del cliente debe tener un formato válido.');
      }
    },
  },
  contacto: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El número de contacto del cliente no puede ser vacío.');
      }
      if (!value.match(/^\d{9}$/)) {
        throw new Error('El número de contacto del cliente debe tener un formato válido: [9 dígitos].');
      }
    },
  },
});

// Exportar el modelo de clientes
export const Cliente = model<ClienteInterface>('Cliente', ClienteSchema);
