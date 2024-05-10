import { Document, model, Schema } from 'mongoose';

/**
 * @brief Esquema de la base de datos de proveedores
 * id: Identificador del proveedor
 * nombre: Nombre del proveedor
 * correo: Correo del proveedor
 * direccion: Dirección del proveedor
 */
export interface ProviderInterface extends Document {
  cif: string;
  nombre: string;
  correo: string;
  direccion: string;
}

/**
 * @brief Esquema de la colección de proveedores
 */
export const ProviderSchema: Schema = new Schema<ProviderInterface>({
  cif: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El CIF del proveedor no puede ser vacío.');
      }
      if (value.length !== 9) {
        throw new Error('El CIF del proveedor debe tener 9 caracteres.');
      }
      if (!/^[A-Z]\d{8}$/.test(value)) {
        throw new Error('El CIF del proveedor debe tener un formato válido: [1 letra mayúscula][8 dígitos].');
      }
    },
  },
  nombre: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre del proveedor no puede ser vacío.');
      }
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre del proveedor debe comenzar con mayúscula.');
      }
    },
  },
  correo: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El correo del proveedor no puede ser vacío.');
      }
      if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        throw new Error('El correo del proveedor debe tener un formato válido.');
      }
    },
  },
  direccion: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('La dirección del proveedor no puede ser vacía.');
      }
    },
  },
});

// Exportar el modelo de proveedores
export const Provider = model<ProviderInterface>('Provider', ProviderSchema);
