import { Mueble } from "./models/furnitures_models.js";
import { TuplaMueble } from "./models/transactions_models.js";
import { Schema } from "mongoose";

/**
 * Cuerpo que contiene la información de un mueble dentro una transacción
 * @typedef {Object} CuerpoMueble
 */
export interface CuerpoMueble {
  nombre: string;
  material: string;
  color: string;
}


