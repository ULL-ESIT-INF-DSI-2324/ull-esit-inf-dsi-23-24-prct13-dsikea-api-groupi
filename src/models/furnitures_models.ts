import { Document, Schema, model } from 'mongoose';

export enum TipoMueble {
  Silla = 'Silla',
  Mesa = 'Mesa',
  Cama = 'Cama',
  Armario = 'Armario',
  Sofa = 'Sofa',
  Estanteria = 'Estanteria',
}

export enum MaterialMueble {
  Madera = 'Madera',
  Metal = 'Metal',
  Plastico = 'Plastico',
}

export enum ColorMueble {
  Blanco = 'Blanco',
  Negro = 'Negro',
  Amarillo = 'Amarillo',
  Rojo = 'Rojo',
  Azul = 'Azul',
  Verde = 'Verde',
  Naranja = 'Naranja',
}

/**
 * @brief Interfaz para modelar un mueble
 * id: Identificador único del mueble
 * nombre: Nombre del mueble
 * tipo: Tipo del mueble (ej. silla, mesa, armario, etc.)
 * material: Material del mueble (ej. madera, metal, plástico, etc.)
 * precio: Precio del mueble
 */
export interface MuebleInterface extends Document {
  nombre: string;
  tipo: TipoMueble;
  material: MaterialMueble;
  descripcion: string;
  color: ColorMueble;
  precio: number;
  cantidad: number;
}

export const MuebleSchema: Schema = new Schema<MuebleInterface>({
  nombre: {
    type: String,
    required: [true, 'El nombre del mueble es requerido'],
    validate: {
      validator: (value: string) => {
        return value.length > 0;
      },
      message: 'El nombre del mueble no puede ser vacío',
    },
  },
  tipo: {
    type: String,
    enum: {
      values: Object.values(TipoMueble),
      message: 'Ese tipo de mueble no está disponible en la tienda',
    },
    required: [true, 'El tipo del mueble es requerido'],
  },
  material: {
    type: String,
    enum: {
      values: Object.values(MaterialMueble),
      message: 'Ese material no está disponible en la tienda',
    },
    required: [true, 'El material del mueble es requerido'],
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción del mueble es requerida'],
    validate: {
      validator: (value: string) => {
        return value.length > 0;
      },
      message: 'La descripción del mueble no puede ser vacía',
    },
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad del mueble es requerida'],
    validate: {
      validator: (value: number) => {
        return value > 0;
      },
      message: 'La cantidad del mueble debe ser mayor que 0',
    },
  },
  color: {
    type: String,
    enum: {
      values: Object.values(ColorMueble),
      message: 'Ese color no está disponible en la tienda',
    },
    required: [true, 'El color del mueble es requerido'],
  },
  precio: {
    type: Number,
    required: [true, 'El precio del mueble es requerido'],
    validate: {
      validator: (value: number) => {
        return value > 0;
      },
      message: 'El precio del mueble debe ser mayor que 0',
    },
  },
});

// Exportar el modelo de muebles
export const Mueble = model<MuebleInterface>('Mueble', MuebleSchema);
