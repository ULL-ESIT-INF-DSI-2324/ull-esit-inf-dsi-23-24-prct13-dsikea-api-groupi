import { Document, connect, model, Schema } from 'mongoose';

// Esquema de la base de datos de proveedores
connect('mongodb://127.0.0.1:27017/providers')
  .then(() => {
    console.log('Conectado a la base de datos');
  })
  .catch(() => {
    console.log('Algo fallo al intentar conectarse a la base de datos de proveedores');
  });

type Furniture = {
  alto: number;
  ancho: number;
  largo: number;
};

/**
 * @brief Interfaz de la base de datos de muebles
 */
export interface FurnitureDocument extends Document {
  id: string;
  tipo_mueble: string;
  nombre: string;
  material_mueble: string;
  descripcion_mueble: string;
  precio: number;
  cantidad: number;
  dimesiones_mueble: Furniture;
  color_mueble: string;
}

/**
 * @brief Esquema de la base de datos de muebles
 * @param id: string
 * @param tipo_mueble: string
 * @param nombre: string
 * @param material_mueble: string
 * @param descripcion_mueble: string
 * @param precio: number
 * @param cantidad: number
 * @param dimesiones_mueble: Furniture
 * @param color_mueble: string
 * @return FurnitureDocument
 * @throws Error si el id del mueble no es valido
 */

export const FurnitureSchema = new Schema<FurnitureDocument>({
  id: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: (value: string) => {
      if (value.length < 0) {
        throw new Error('El id del mueble no puede ser vacio');
      }
      if (value.length > 50) {
        throw new Error('El id del mueble no puede tener mas de 50 caracteres');
      }
    },
  },
  tipo_mueble: {
    type: String,
    required: true,
    lowercase: true,
    validate: (value: string) => {
      if (value.length < 0) {
        throw new Error('El tipo de mueble no puede ser vacio');
      }
      if (value.length > 50) {
        throw new Error('El tipo de mueble no puede tener mas de 50 caracteres');
      }
    },
  },
  nombre: {
    type: String,
    required: true,
    lowercase: true,
    validate: (value: string) => {
      if (value.length < 0) {
        throw new Error('El nombre del mueble no puede ser vacio');
      }
      if (value.length > 50) {
        throw new Error('El nombre del mueble no puede tener mas de 50 caracteres');
      }
    },
  },
  material_mueble: {
    type: String,
    required: true,
    lowercase: true,
    enum: ['madera', 'plástico', 'metal', 'vidrio'],
  },
  descripcion_mueble: {
    type: String,
    required: true,
    lowercase: true,
    validate: (value: string) => {
      if (value.length < 0) {
        throw new Error('La descripcion del mueble no puede ser vacio');
      }
      if (!value.endsWith('.')) {
        throw new Error('La descripcion del mueble debe terminar con un punto');
      }
    },
  },
  precio: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El precio del mueble no puede ser negativo');
      }
      if (/\d/.test(value.toString()) == false) {
        throw new Error('El precio del mueble no puede contener letras');
      }
    },
  },
  cantidad: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('La cantidad del mueble no puede ser negativa');
      }
      if (/\d/.test(value.toString()) == false) {
        //si no es un numero
        throw new Error('La cantidad del mueble no puede contener letras');
      }
    },
  },
  dimesiones_mueble: {
    alto: {
      type: Number,
      required: true,
      validate: (value: number) => {
        if (value < 0) {
          throw new Error('El alto del mueble no puede ser negativo');
        }
      },
    },
    ancho: {
      type: Number,
      required: true,
      validate: (value: number) => {
        if (value < 0) {
          throw new Error('El ancho del mueble no puede ser negativo');
        }
      },
    },
    largo: {
      type: Number,
      required: true,
      validate: (value: number) => {
        if (value < 0) {
          throw new Error('El largo del mueble no puede ser negativo');
        }
      },
    },
  },
});

/**
 * Exportación de muebles
 */
export const muebleModel = model<FurnitureDocument>('Muebles', FurnitureSchema);
