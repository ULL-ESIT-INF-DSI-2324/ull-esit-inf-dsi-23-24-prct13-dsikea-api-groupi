/*
import express, { Request, Response } from 'express';
import { customerModel, ClienteInterface } from '../models/customers_models.js';
import validator from 'validator';

export const customersRouter = express.Router();
*/
/**
 * Manejador para la creación de un nuevo cliente
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente creado o un mensaje de error
 */
/*
customersRouter.post('/customers', async (req: Request, res: Response) => {
  try {
    const cliente = new customerModel(req.body);
    await cliente.save();
    res.status(201).send(cliente);
  } catch (error) {
    res.status(400).send(error);
  }
});
*/
/**
 * Manejador para leer un cliente en concreto por su nif
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente encontrado o un mensaje de error
 */
/*
customersRouter.get('/customers/:nif', async (req: Request, res: Response) => {
  try {
    const buscarCliente = await customerModel.findOne({ dni: req.params.nif });
    if (!buscarCliente) {
      res.status(404).send({ msg: 'No se encontró el cliente' });
    } else {
      res.status(200).send(buscarCliente);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
*/
/**
 * Actualiza un cliente de la base de datos haciendo uso de la QueryString.
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente actualizado o un mensaje de error
 */
/*
customersRouter.patch('/customers/:nif', async (req: Request, res: Response) => {
  try {
    const clienteActualizado = await customerModel.findOneAndUpdate({ dni: req.params.nif }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!clienteActualizado) {
      res.status(404).json({ msg: 'No se encontró el cliente' });
    } else {
      res.status(200).send(clienteActualizado);
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar el cliente', error: error });
  }
});
*/
/**
 * Actualiza un cliente de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente actualizado o un mensaje de error
 */
/*
customersRouter.patch('/customers/:nif', async (req: Request, res: Response) => {
  try {
    const clienteActualizado = await customerModel.findByIdAndUpdate(req.params.nif, req.body, {
      new: true,
      runValidators: true,
    });
    if (!clienteActualizado) {
      res.status(404).json({ msg: 'No se encontró el cliente' });
    } else {
      res.status(200).send(clienteActualizado);
    }
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar el cliente', error: error });
  }
});
*/
/**
 * Elimina un cliente de la base de datos haciendo uso de la QueryString o del identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente eliminado o un mensaje de error
 */
/*
customersRouter.delete('/customers', async (req: Request, res: Response) => {
  try {
    const { nif, customerId } = req.query as { nif?: string; customerId?: string };
    let clienteEliminado;

    if (nif) {
      clienteEliminado = await customerModel.findOneAndDelete({ dni: nif });
    } else if (customerId) {
      clienteEliminado = await customerModel.findByIdAndDelete(customerId);
    } else {
      return res.status(400).json({ message: 'Se requiere nif o customerId' });
    }

    if (!clienteEliminado) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.status(200).send(clienteEliminado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar el cliente', error: error });
  }
});
*/
/**
 * Elimina un cliente de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente eliminado o un mensaje de error
 */
/*
customersRouter.delete('/customers/:id', async (req: Request, res: Response) => {
  try {
    const clienteEliminado = await customerModel.findByIdAndDelete(req.params.id);
    if (!clienteEliminado) {
      return res.status(404).json({ msg: 'No se encontró el cliente' });
    }
    res.status(200).send(clienteEliminado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar el cliente', error: error });
  }
});
*/