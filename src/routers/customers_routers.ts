import express from 'express';
import { Cliente, ClienteInterface } from '../models/customers_models.js';

export const customerRouter = express.Router();
customerRouter.use(express.json());

/**
 * Manejador para la creación de un nuevo cliente
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente creado o un mensaje de error
 */
customerRouter.post('/customers', async (req, res) => {
  try {
    const duplicatedCliente = await Cliente.findOne({ dni: req.body.dni });
    if (duplicatedCliente) {
      return res.status(400).send({ msg: 'Ya existe un cliente con ese dni' });
    }
    const cliente = new Cliente(req.body);
    await cliente.save();
    return res.status(201).send({ msg: 'El cliente se ha creado con éxito', Cliente: Cliente });
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Manejador para buscar un cliente en la base de datos a partir del dni
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente encontrado o un mensaje de error
 */
customerRouter.get('/customers', async (req, res) => {
  try {
    const dni = req.query.dni;
    if (!dni) {
      return res.status(400).send({ msg: 'No se proporcionó un dni' });
    }
    const clienteEncontrado: ClienteInterface | null = await Cliente.findOne({ dni: dni });
    if (!clienteEncontrado) {
      return res.status(404).send({ msg: 'El cliente no fue encontrado en la base de datos' });
    }
    return res.status(200).send({ msg: 'El cliente fue encontrado con éxito', Cliente: clienteEncontrado });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al buscar el cliente', error: error });
  }
});

/**
 * Manejador para buscar un cliente por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente encontrado o un mensaje de error
 */
customerRouter.get('/customers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).send({ msg: 'cliente no encontrado' });
    }
    return res.status(200).send({ msg: 'cliente encontrado por id con éxito', cliente: cliente });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al buscar el cliente', error: error });
  }
});

/**
 * Manejador para actualizar un cliente por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente actualizado o un mensaje de error
 */
customerRouter.patch('/customers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const updatedCliente = await Cliente.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCliente) {
      return res.status(404).send({ msg: 'cliente no encontrado' });
    }
    return res.status(200).send({ msg: 'Se ha actualizado correctamente el cliente', Cliente: updatedCliente });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al actualizar el cliente', error });
  }
});

/**
 * Manejador para actualizar por dni un cliente de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente actualizado o un mensaje de error
 */
customerRouter.patch('/customers', async (req, res) => {
  const dni = req.query.dni;
  if (!dni) {
    return res.status(400).send({ msg: 'No se proporcionó un dni' });
  }
  try {
    const updatedCliente = await Cliente.findOneAndUpdate({ dni: dni }, req.body, { new: true });
    if (!updatedCliente) {
      return res.status(404).send({ msg: 'cliente no encontrado' });
    }
    return res.status(200).send({ msg: 'Se ha actualizado correctamente el cliente', Cliente: updatedCliente });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al actualizar el cliente', error });
  }
});

/**
 * Manejador para eliminar un cliente POR dni de la base de datos por dni haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente eliminado o un mensaje de error
 */
customerRouter.delete('/customers', async (req, res) => {
  const dni = req.query.dni;
  if (!dni) {
    return res.status(400).send({ msg: 'No se proporcionó un dni' });
  }
  try {
    const deletedCliente = await Cliente.findOneAndDelete({ dni: dni });
    if (!deletedCliente) {
      return res.status(404).send({ msg: 'cliente no encontrado' });
    }
    return res.status(200).send({ msg: `cliente ${deletedCliente.nombre} eliminado con éxito`, Cliente: deletedCliente });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar el cliente', error });
  }
});

/**
 * Manejador para eliminar un cliente por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente eliminado o un mensaje de error
 */
customerRouter.delete('/customers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedCliente = await Cliente.findByIdAndDelete(id);
    if (!deletedCliente) {
      return res.status(404).send({ msg: 'cliente no encontrado' });
    }
    return res.status(200).send(deletedCliente);
  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar el cliente', error });
  }
});
