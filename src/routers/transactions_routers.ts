import express from 'express';
import { Transaction } from '../models/transactions_models.js';
import { Cliente } from '../models/customers_models.js';
import { Mueble } from '../models/furnitures_models.js';
import { Provider } from '../models/providers_models.js';

export const transactionRouter = express.Router();
transactionRouter.use(express.json());

/**
 * Maneja la creación de una nueva transacción (compra o venta).
 */
transactionRouter.post('/transaction', async (req, res) => {
  try {
    const { tipo, muebles, clienteID, provedorID, fecha } = req.body;


     if (!tipo || !muebles || !fecha) {
      return res.status(400).json({ msg: 'Faltan campos obligatorios' });
     }

     //return res.status(200).json({ msg: 'Transacción creada con éxito' });
    // Verificar si el tipo de transacción es válido
    if (tipo !== 'Compra' && tipo !== 'Venta') {
      return res.status(400).json({ msg: 'Tipo de transacción no válido' });
    }

 


    // Verificar si se proporcionó el ID del proveedor ó cliente verificar si existe
    let proveedor, cliente;
    if (provedorID || clienteID) {
      proveedor = await Provider.findById(provedorID);
      cliente = await Cliente.findById(clienteID);

      if (!proveedor || !cliente) {
        return res.status(404).json({ error: 'El proveedor especificado no existe.' });
      }
    }
    let totalPrice = 0;

    if(tipo === 'Compra' && !proveedor) {

    // Validar y obtener el precio total de la transacción
    for (const muebleItem of muebles) {
      
      const mueble = await Mueble.findById(muebleItem.IDMueble);

      if (!mueble) {
        return res.status(400).json({ msg: `El mueble con ID ${muebleItem.IDMueble} no existe.` });
      }

      // si la cantidad de mueble en stock es menor a 0 no se puede realizar la transaccion
      if (mueble.cantidad < muebleItem.cantidad) {
        return res.status(400).json({ msg: `La cantidad de ${mueble.nombre} con ID: ${mueble._id} debe ser mayor a 0.` });
      } 

      // Restar la cantidad deseada del stock del mueble si hay suficiente cantidad disponible
      const cantidadRestante = mueble.cantidad - muebleItem.cantidad;
      if (cantidadRestante > 0) {
        mueble.cantidad = cantidadRestante;
        await mueble.save();

        // si la cantidad de mueble en stock es 0 eliminar el mueble de la base de datos
      } else if (cantidadRestante === 0) {
        try {
          const muebleEliminado = await Mueble.findByIdAndDelete(mueble._id);
          if (!muebleEliminado) {
            return res.status(400).json({ msg: `No se pudo eliminar el mueble con ID ${mueble._id}` });
          }
          return res.status(200).send({ msg: 'Mueble eliminado por id con éxito' });
        } catch (error) {
          return res.status(500).json({ error: 'Error al eliminar el mueble al ser 0' });
        }
      } else {
        // Si la cantidad restante es cero o negativa, devuelve un mensaje de error
        return res.status(400).json({ msg: `No se puede restar la cantidad especificada del mueble con ID ${muebleItem.IDMueble} = ${mueble.cantidad} - ${muebleItem.cantidad}` });
      }

    }
    // Calcular el precio total de la transacción
    //console.log("Precio total:",totalPrice);
    // Crear una nueva instancia de transacción con los datos proporcionados
    const transaction = new Transaction({
      tipo,
      cliente: clienteID ? cliente : undefined,
      proveedor: provedorID ? proveedor : undefined,
      muebles,
      fecha,
      precio: totalPrice, // Calcular el precio total de la transacción
    });
    // Guardar la nueva transacción en la base de datos
    await transaction.save();

    // Enviar una respuesta con la transacción creada
    return res.status(201).json(transaction);


  } else if(tipo === 'Venta' && !cliente) {
    // Validar y obtener el precio total de la transacción
    
      for (const muebleItem of muebles) {
        const mueble = await Mueble.findById(muebleItem.IDMueble);
        if (!mueble) {
          return res.status(400).json({ msg: `El mueble con ID ${muebleItem.IDMueble} no existe.` });
        }
        const cantidad = muebleItem.cantidad;
        const mueblePrice = cantidad * mueble.precio;
        totalPrice += mueblePrice;
      }
        // Crear una nueva instancia de transacción con los datos proporcionados
        const transaction = new Transaction({
        tipo,
        cliente: clienteID ? cliente : undefined,
        proveedor: provedorID ? proveedor : undefined,
        muebles,
        fecha,
        precio: totalPrice, // Calcular el precio total de la transacción
    });

    // Guardar la nueva transacción en la base de datos
    await transaction.save();

    // Enviar una respuesta con la transacción creada
    return res.status(201).json(transaction);
    } else {
      return res.status(400).json({ msg: 'El cliente o proveedor no es necesario para una venta o compra respectivamente' });
    }
 

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});
