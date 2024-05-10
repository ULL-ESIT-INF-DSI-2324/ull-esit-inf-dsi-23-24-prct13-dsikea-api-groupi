import { Document, model, Schema } from 'mongoose';
import validator from 'validator';



/**
 * @brief Esquema de la base de datos de cliente
 * nombre: Nombre del cliente
 * id: Identificador del cliente
 * correo: Correo del cliente
 * direccion: Dirección del cliente
 */
interface ClienteInterface extends Document {
  nombre: string;
  dni: string;
  correo: string;
  contacto: number;
}

/**
 * @brief Esquema de la colección de proveedores
 */
const ClienteEsquema = new Schema<ClienteInterface>({
  nombre: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre del cliente no puede ser vacío.');
      } else if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre del cliente debe comenzar con mayúscula.');
      } else if (!validator.default.isAlphanumeric(value)) {
        throw new Error('El nombre del cliente debe contener únicamente caracteres alfanuméricos');
      }
    },
  },
  dni: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El ID del cliente no puede ser vacío.');
      }
      if (value.length !== 9) {
        throw new Error('El ID del cliente debe tener 9 caracteres.');
      }
      if (!/^\d{8}\w{1}$/.test(value)) {
        throw new Error('El ID del cliente debe tener un formato válido: [8 dígitos][1 letras mayúsculas].');
      }
    },
  },
  correo: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Correo electrónico inválido',
    },
  },
  contacto: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El contacto del cliente no puede ser negativo.');
      }
      if (value % 1 !== 0) {
        throw new Error('El contacto del cliente no puede ser un número decimal.');
      }
      if (value.toString().length !== 9) {
        throw new Error('El contacto del cliente debe tener 9 dígitos.');
      }
      if (!/^[6-9]/.test(value.toString())) {
        throw new Error('El contacto del cliente debe empezar por 6, 7, 8 o 9.');
      }
    },
  },
});

export const customerModel = model<ClienteInterface>('Cliente', ClienteEsquema);
