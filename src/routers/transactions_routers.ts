/*
import express from 'express';
import { Transaction } from '../models/transactions_models.js';
import { Customer } from '../models/customers_models.js';
import { Provider } from '../models/providers_models.js';
import { Mueble } from '../models/furnitures_models.js';
import { TuplaMueble } from '../models/transactions_models.js';
import { Schema } from 'mongoose';

export const transactionRouter = express.Router();
transactionRouter.use(express.json());
*/
// Funciones previas a los manejadores

/**
 * @brief Resetea la cantidad de muebles en una transacción, puede ser una compra o una venta
 * @param transaction
 * @param isPurchase
 * @returns
 */

/*
async function adjustPurchase(transaction: TuplaMueble[], isPurchase: boolean) {
    for (const item of transaction) {
      const furnitureItem = await Mueble.findOneAndUpdate(
        { _id: item.mueble },
        { $inc: { cantidad: isPurchase ? -item.cantidad : item.cantidad } },
        { new: true }
      );
      if (!furnitureItem) {
        return { error: 'Mueble no encontrado' };
      }
    }
  }
  
  // interfaz para representar los muebles en la transacción
  interface MueblesTransaccion {
    cantidad: number;
    nombre: string;
    material: string;
    color: string;
  }
*/
  /**
   * @brief Busca los muebles en la base de datos y calcula el precio total de la transacción
   * @param furniture
   * @param isPurchase
   * @returns
   */

  /*
  async function fetchTransaction(muebles: MueblesTransaccion[]) {
    let precioFinal: number = 0;
    const buscarMueble: [Schema.Types.ObjectId, number][] = [];
    for (const item of muebles) {
      const buscarMuebleColor = await Mueble.findOneAndUpdate(
        { name: item.nombre, material: item.material, color: item.color },
        { $inc: { cantidad: item.cantidad } },
        { new: true }
      );
      if (!buscarMuebleColor) {
        return {
          error: 'El mueble no fue encontrado',
          muebles: buscarMueble,
        };
      }
      precioFinal += buscarMuebleColor.precio * item.cantidad;
      buscarMueble.push([buscarMuebleColor._id, item.cantidad]);
    }
    return { muebles: buscarMueble, precioFinal: precioFinal };
  }
*/
// manejadores

/*
transactionRouter.post('/transactions', async (req, res) => {
  const { esCompra, clienteOProveedorId, muebles, fechaHora } = req.body;

  // Verificar si es una compra o venta y buscar el cliente o proveedor correspondiente
  const clienteOProveedor = esCompra
    ? await Customer.findById(clienteOProveedorId)
    : await Provider.findById(clienteOProveedorId);

  if (!clienteOProveedor) {
    return res.status(404).json({ error: 'Cliente o proveedor no encontrado' });
  }

  // Buscar los muebles y calcular el precio total
  const transactionResult = await fetchTransaction(muebles);
  if (transactionResult.error) {
    return res.status(400).json({ error: transactionResult.error });
  }

  // Crear la transacción
  const transaccion = new Transaction({
    esCompra,
    clienteOProveedor: clienteOProveedorId,
    muebles: transactionResult.muebles,
    fechaHora,
    precioTotal: transactionResult.precioFinal,
  });

  // Guardar la transacción en la base de datos
  const savedTransaccion = await transaccion.save();

  // Ajustar la cantidad de muebles
  const adjustResult = await adjustPurchase(transactionResult.muebles, esCompra);
  if (adjustResult && adjustResult.error) {
    return res.status(400).json({ error: adjustResult.error });
  }

  // Responder con la transacción guardada
  res.json(savedTransaccion);
});
*/

