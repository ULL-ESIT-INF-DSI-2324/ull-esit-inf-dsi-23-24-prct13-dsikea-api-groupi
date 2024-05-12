import express from 'express';
import { Transaction, TuplaMueble } from '../models/transactions_models.js';
import { Cliente } from '../models/customers_models.js';
import { Mueble } from '../models/furnitures_models.js';
import { Provider } from '../models/providers_models.js';

export const transactionRouter = express.Router();
transactionRouter.use(express.json());

/**
 * Crea pares de identificadores de muebles y cantidad a partir de la lista de muebles proporcionada.
 * Para cada mueble en la lista, busca el mueble en la base de datos por su nombre y luego crea un 
 * par con el identificador del mueble y la cantidad solicitada. Devuelve una matriz de estos pares.
 * @param ListaMuebles 
 * @returns una array de tupla del id_mueble y la cantidad de ese mueble.
 * @throws {Error} - Error de mueble no encontrado
 * @throws {Error} - Error de servidor
 * @throws {Error} - Error de stock insuficiente
 */
async function Creararraymuebles(ListaMuebles: any[]): Promise<TuplaMueble[]> {
  const pairsIdAmount : TuplaMueble[]= [];
  for (const mueble of ListaMuebles) {
    const mueble_encontrado = await Mueble.findById( mueble._id );
    if (!mueble_encontrado) {
      throw new Error("Mueble no encontrado en la base de datos");
    }
    pairsIdAmount.push({ _id : mueble_encontrado._id, cantidad: mueble.cantidad });
  }
  return pairsIdAmount;
}

/**
 * Calcula el importe total de la transacción a partir de la lista de muebles proporcionada.
 * Para cada mueble en la lista, busca el mueble en la base de datos por su nombre y luego calcula
 * el importe total de la transacción sumando el precio del mueble por la cantidad solicitada.
 * @param ListaMuebles
 * @returns el importe total de la transacción
 * @throws {Error} - Error de mueble no encontrado
 * @throws {Error} - Error de servidor
 * @throws {Error} - Error de stock insuficiente
 */
async function calculateAmount(ListaMuebles: any[]): Promise<number> {
  let amount = 0;
  for (const mueble of ListaMuebles) {
    const mueble_encontrado = await Mueble.findById(mueble._id );
    if (!mueble_encontrado) {
      throw new Error("Mueble no encontrado en la base de datos");
    }
    amount += mueble_encontrado.precio * mueble.cantidad;
  }
  return amount;
}

/**
 * Actualiza el stock de los muebles en la base de datos.
 * @param ListaMuebles lista de muebles a vender o comprar
 * @param tipo tipo de transacción (Venta o Compra)
 * @returns {Object} - Objeto JSON con el mensaje de éxito o un mensaje de error
 * @throws {Error} - Error de mueble no encontrado
 * @throws {Error} - Error de stock insuficiente
 * @throws {Error} - Error de servidor
 */
async function Actualizarstock(ListaMuebles: any, tipo: string) {
  if (tipo === 'Venta') {
    for (const mueble of ListaMuebles) {
      const mueble_encontrado = await Mueble.findById( mueble._id );
      if (!mueble_encontrado) {
        throw new Error("Mueble no encontrado en la base de datos");
      }
      if (mueble_encontrado.cantidad < mueble.cantidad) {
        throw new Error("No hay suficiente stock para realizar la transacción");
      }
      const cantidadstock = mueble_encontrado.cantidad;
      mueble_encontrado.cantidad = cantidadstock - mueble.cantidad;
      await mueble_encontrado.save();
    }
  } else if (tipo === 'Compra') {
    for (const mueble of ListaMuebles) {
      const mueble_encontrado = await Mueble.findById(mueble._id );
      if (!mueble_encontrado) {
        throw new Error("Mueble no encontrado en la base de datos");
      }
      const cantidadstock = mueble_encontrado.cantidad;
      mueble_encontrado.cantidad =  cantidadstock + mueble.cantidad;
      await mueble_encontrado.save();
    }
  }
}

/**
 * Crea una nueva transacción de venta o compra.
 * @param tipo tipo de transacción (Venta o Compra)
 * @param muebles lista de muebles a vender o comprar
 * @param clienteID identificador único del cliente
 * @param proveedorID identificador único del proveedor
 * @returns {Object} - Objeto JSON con la transacción creada o un mensaje de error
 * @throws {Error} - Error de servidor
 * @throws {Error} - Error de campos obligatorios faltantes
 * @throws {Error} - Error de cliente no encontrado
 * @throws {Error} - Error de proveedor no encontrado
 */
transactionRouter.post('/transactions', async (req, res) => {
  try {
    if (req.body.tipo === 'Venta' && req.body.clienteID === undefined ||
      req.body.tipo === 'Compra' && req.body.proveedorID === undefined ||
      req.body.muebles === undefined) {
      res.status(400).send({ msg: 'Faltan campos obligatorios' });
    }
    if (req.body.tipo === 'Venta') {
      const cliente = await Cliente.findById( req.body.clienteID );
      if (!cliente) {
        return res.status(404).send({ msg: 'El cliente especificado no existe.' });
      }
      const tipo = req.body.tipo;
      await Actualizarstock(req.body.muebles, tipo);
      const transformarMuebles = await Creararraymuebles(req.body.muebles);
      const precio_importe = await calculateAmount(req.body.muebles);
      const transaction = new Transaction({
        tipo: tipo,
        muebles: transformarMuebles,
        cliente,
        fecha: new Date(),
        precio: precio_importe,
      });
      await transaction.save();
      return res.status(201).send({ msg: ' Transacion de venta completada'  });
    } else if (req.body.tipo === 'Compra') {
      const proveedor = await Provider.findById( req.body.proveedorID );
      if (!proveedor) {
        return res.status(404).send({ msg: 'El proveedor especificado no existe.' });
      }
      const tipo = req.body.tipo;
      await Actualizarstock(req.body.muebles, tipo);
      const transformarMuebles = await Creararraymuebles(req.body.muebles);
      const precio_importe = await calculateAmount(req.body.muebles);
      const transaction = new Transaction({
        tipo: tipo,
        muebles: transformarMuebles,
        proveedor,
        fecha: new Date(),
        precio: precio_importe,
      });
      await transaction.save();
      return res.status(201).send({ msg: "Transacion de compra completada" });
    }
    return res.status(500).send({ msg: '1. Error en el servidor' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: '2. Error en el servidor' });
  }
});

/**
 * Obtiene todas las transacciones de un cliente.
 * @param dni identificador unico del cliente
 * @returns {Object} - Objeto JSON con las transacciones encontradas o un mensaje de error
 * @throws {Error} - Error de servidor
 * @throws {Error} - Error de cliente no encontrado
 * @throws {Error} - Error al obtener la transacción
 */
transactionRouter.get('/transactions/cliente', async (req, res) => {
  const  dnicliente = req.query.dni; // Obtener el ID de la transacción de los parámetros de la ruta
	try {
		const cliente = await Cliente.findOne({ dni: dnicliente });
    if (!cliente) {
      return res.status(400).send({ msg: "No existe cliente con este DNI" });
    } 
    const transaccion = await Transaction.find({ cliente: cliente });
		if (!transaccion) {
      return res.status(404).send("Transaccion no encontrada");
    }
		return res.status(200).send(transaccion);
	} catch (error) {
		return res.status(500).send({ msg: "Error al realizar esta transaccion" });
	}
});

/**
 * Obtiene todas las transacciones de un proveedor.
 * @param cif identificador unico del proveedor
 * @returns {Object} - Objeto JSON con las transacciones encontradas o un mensaje de error
 * @throws {Error} - Error de servidor
 * @throws {Error} - Error de proveedor no encontrado
 */
transactionRouter.get('/transactions/proveedor', async (req, res) => {
  const cif_peticion = req.query.cif; // Obtener el ID de la transacción de los parámetros de la ruta
	try {
		const provider = await Provider.findOne({ cif: cif_peticion });
		if (!provider) {
			return res.status(404).send({ msg: ' Provedor no encontrado por lo que transaccion no existe' });
		}
		const transaccion = await Transaction.find({ proveedor: provider });
		if (transaccion) {
      return res.status(200).send(transaccion);
      
		}
    return res.status(404).send({ msg: ' Transaccion no encontrada' });
	} catch (error) {
		return res.status(500).send({ msg: 'Error al consultar transacción' });
	}
});

/**
 * Obtiene una transacción por su id.
 * @param id identificador unico del transaccion
 * @returns {Object} - Objeto JSON con la transacción encontrada o un mensaje de error
 * @throws {Error} - Error de servidor
 * @throws {Error} - Error de transacción no encontrada
 * @throws {Error} - Error al obtener la transacción
 */
transactionRouter.get('/transactions/:id', async (req, res) => {
  const transaccionId = req.params.id; // Obtener el ID de la transacción de los parámetros de la ruta
  try {
    // Buscar la transacción por su ID
    const transacciones = await Transaction.findById(transaccionId);
    // Verificar si la transacción existe
    if (!transacciones) {
      return res.status(404).send({ msg: 'La transacción no fue encontrada' });
    }
    // Devolver la transacción encontrada
    return res.status(200).send(transacciones);
  }
  catch (error) {
    return res.status(500).send({ msg: 'Error al obtener la transacción'});
  }
}); 

/**
 * Manejador para eliminar una transaccion por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto send con el proveedor eliminado o un mensaje de error
 */
transactionRouter.delete('/transactions/:id', async (req, res) => {
  try {
    const transaccionId = req.params.id; // Obtener el ID de la transacción de los parámetros de la ruta
    // Buscar la transacción por su ID
    const transacciones = await Transaction.findById(transaccionId);

    // Verificar si la transacción existe
    if (!transacciones) {
      return res.status(404).send({ msg: 'La transacción no fue encontrada' });
    }

    // Eliminar la transacción de la base de datos
    try {
      const eliminartransaccion = await Transaction.findByIdAndDelete(transaccionId);
      if (!eliminartransaccion) {
        return res.status(404).send({ msg: 'Transacción no encontrada para eliminar' });
      }
    } catch (error) {
      return res.status(500).send({ msg: 'Error al eliminar la transaccion' });
    }
    
    return res.status(200).send({ msg:'Transacción eliminada correctamente' });

  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar la transacción:', error});
  }
});

/**
 * Manejador para actualizar una transaccion por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la transacción actualizada o un mensaje de error
 */

transactionRouter.patch('/transactions/:id', async (req, res) => {
  try {
    const transaccionId = req.params.id; // Obtener el ID de la transacción de los parámetros de la ruta
    // Verificar si la transacción existe
    const transacciones = await Transaction.findById(transaccionId);
    if (!transacciones) {
      return res.status(404).send({ msg: 'La transacción no fue encontrada' });
    }
    const mueble = await Creararraymuebles(req.body.muebles); // Se crea la tupla de Mueble
    if(mueble){
      await Actualizarstock(mueble, transacciones.tipo); // Se comprueba que los muebles existen y demás y se actualiza
    }
    
    if (req.body.tipo === 'Venta' && req.body.clienteID === undefined ||
      req.body.tipo === 'Compra' && req.body.proveedorID === undefined) {
      res.status(400).send({ msg: 'Falta el campo tipo o clienteID o proveedorID dependiendo del tipo compra ó venta' });
    }

    // Verificar si el array de muebles tiene al menos un elemento
    if (!req.body.muebles || req.body.muebles.length === 0) {
      return res.status(400).send({ msg: 'Se requiere al menos un mueble' });
    }

    const precio_importe = await calculateAmount(req.body.muebles);
    // Actualizar la transacción
    const actualizarTransaccion = await Transaction.findByIdAndUpdate(
      req.params.id, // Buscar la transacción por su ID
      { $set: req.body, fecha: new Date(), precio: precio_importe,  }, // Actualizar el cuerpo de la transacción y el precio
      { new: true } // Devolver la transacción actualizada
    );    
    if(actualizarTransaccion){ // Verificar si la transacción fue actualizada
      return res.send(actualizarTransaccion);
    }
    return res.status(404).send({ msg: 'Transacción no encontrada' });
  } catch (error) {
    return res.status(500).send( {msg: `Error al actualizar la transacción:`, error});
  } 
});