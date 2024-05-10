import express from 'express';
import { ProviderInterface, Provider } from '../models/providers_models.js';

// objeto router que nos permite definir las rutas
export const providerRouter = express.Router();
providerRouter.use(express.json());

/*
La operación de lectura o consulta podrá llevarse a cabo de dos maneras diferentes: o bien utilizando una query string donde se consulte por el CIF del proveedor, o bien utilizando el identificador único del proveedor (el asignado por el sistema gestor de base de datos) como parámetro dinámico. Las operaciones de modificación y borrado de un proveedor también se podrán llevar a cabo de ambos modos.

Teniendo en cuenta lo anterior, como mínimo, tendrá que escribir un total de siete manejadores diferentes para esta ruta.
*/

/**
 * Manejador para la creación de un nuevo proveedor
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor creado o un mensaje de error
 */
providerRouter.post('/providers', async (req, res) => {
  try {
    const duplicatedProvider = await Provider.findOne({ cif: req.body.cif });
    if (duplicatedProvider) {
      return res.status(400).send({ msg: 'Ya existe un proveedor con ese cif' });
    }
    const provider = new Provider(req.body);
    await provider.save();
    return res.status(201).send({ msg: 'El Proveedor se ha creado con éxito', provider: provider });
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * Manejador para buscar un proveedor en la base de datos a partir del cif
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor encontrado o un mensaje de error
 */
providerRouter.get('/providers', async (req, res) => {
  try {
    const cif = req.query.cif;
    if (!cif) {
      return res.status(400).send({ msg: 'No se proporcionó un CIF' });
    }
    const proveedorEncontrado: ProviderInterface | null = await Provider.findOne({ cif: cif });
    if (!proveedorEncontrado) {
      return res.status(404).send({ msg: 'El proveedor no fue encontrado en la base de datos' });
    }
    return res.status(200).send({ msg: 'El proveedor fue encontrado con éxito', provider: proveedorEncontrado });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al buscar el proveedor', error: error });
  }
});

/**
 * Manejador para buscar un proveedor por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor encontrado o un mensaje de error
 */
providerRouter.get('/providers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).send({ msg: 'Proveedor no encontrado' });
    }
    return res.status(200).send({ msg: 'Proveedor encontrado por id con éxito', provider: provider });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al buscar el proveedor', error: error });
  }
});

/**
 * Manejador para actualizar un proveedor por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor actualizado o un mensaje de error
 */
providerRouter.patch('/providers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProvider) {
      return res.status(404).send({ msg: 'Proveedor no encontrado' });
    }
    return res.status(200).send({ msg: 'Se ha actualizado correctamente el proveedor', provider: updatedProvider });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al actualizar el proveedor', error });
  }
});

/**
 * Manejador para actualizar por CIF un proveedor de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor actualizado o un mensaje de error
 */
providerRouter.patch('/providers', async (req, res) => {
  const cif = req.query.cif;
  if (!cif) {
    return res.status(400).send({ msg: 'No se proporcionó un CIF' });
  }
  try {
    const updatedProvider = await Provider.findOneAndUpdate({ cif: cif }, req.body, { new: true });
    if (!updatedProvider) {
      return res.status(404).send({ msg: 'Proveedor no encontrado' });
    }
    return res.status(200).send({ msg: 'Se ha actualizado correctamente el proveedor', provider: updatedProvider });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al actualizar el proveedor', error });
  }
});

/**
 * Manejador para eliminar un proveedor POR CIF de la base de datos por CIF haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor eliminado o un mensaje de error
 */
providerRouter.delete('/providers', async (req, res) => {
  const cif = req.query.cif;
  if (!cif) {
    return res.status(400).send({ msg: 'No se proporcionó un CIF' });
  }
  try {
    const deletedProvider = await Provider.findOneAndDelete({ cif: cif });
    if (!deletedProvider) {
      return res.status(404).send({ msg: 'Proveedor no encontrado' });
    }
    return res.status(200).send({ msg: `Proveedor ${deletedProvider.nombre} eliminado con éxito`, provider: deletedProvider });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar el proveedor', error });
  }
});

/**
 * Manejador para eliminar un proveedor por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor eliminado o un mensaje de error
 */
providerRouter.delete('/providers/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedProvider = await Provider.findByIdAndDelete(id);
    if (!deletedProvider) {
      return res.status(404).send({ msg: 'Proveedor no encontrado' });
    }
    return res.status(200).send(deletedProvider);
  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar el proveedor', error });
  }
});
