import { Document, connect, model, Schema } from "mongoose";
import validator from 'validator';

connect('mongodb://127.0.0.1:27017/customer').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

interface Customeinterface extends Document {
  nombre: string,
  dni: string,
  email: string,
  contacto: number
}

const CustomerSchema = new Schema<Customeinterface>({
  nombre: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El ID del cliente no puede ser vacío.');
      }
      else if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre de la nota debe comenzar con mayúscula.');
      } else if (!validator.default.isAlphanumeric(value)) {
        throw new Error('El nombre de la nota debe contener únicamente caracteres alfanuméricos');
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
    }
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "Invalid email",
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
        throw new Error('El contacto del cliente debe empezar por 6,7,8 9.');
      }
    }
  }
});

export default model<Customeinterface>("Customer", CustomerSchema);
