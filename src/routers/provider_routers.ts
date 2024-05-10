import express from 'express';
import { ProviderInterface,  Provider } from '../models/providers_models.js';

// objeto router que nos permite definir las rutas
export const providerRouter = express.Router();

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
    const provider = new Provider(req.body);
    await provider.save();
    res.status(201).send(provider);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * Manejador para buscar un proveedor en la base de datos a partir de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor encontrado o un mensaje de error
 */
providerRouter.get('/providers:cif', async (req, res) => {
  req.query = { ...req.query };
  try {
    let proveedoresEncontrados: ProviderInterface[] = await Provider.find(req.query);
    proveedoresEncontrados = proveedoresEncontrados.flat().filter((x) => x !== null);
    const condition: boolean = proveedoresEncontrados.length === 0;
    res
      .status(condition ? 404 : 200)
      .send(condition ? { msg: 'El proveedor no fue encontrado en la base de datos' } : proveedoresEncontrados);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar el proveedor', error: error });
  }
});

/**
 * Manejador para actualizar por CIF un proveedor de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor actualizado o un mensaje de error
 */
providerRouter.patch('/providers/:cif', async (req, res) => {
    const cif = req.params.cif;
    try {
        const updatedProvider = await Provider.findOneAndUpdate({ cif }, req.body, { new: true });
        if (!updatedProvider) {
            return res.status(404).send({ msg: 'Proveedor no encontrado' });
        }
        return res.status(200).send(updatedProvider);
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
providerRouter.delete('/providers/:cif', async (req, res) => {
  const cif = req.params.cif;
  try {
    const deletedProvider = await Provider.findOneAndDelete({ cif });
    if (!deletedProvider) {
      return res.status(404).send({ msg: 'Proveedor no encontrado' });
    }
    return res.status(200).send(deletedProvider);
  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar el proveedor', error });
  }
});

/**
 * Manejador para listar todos los proveedores de la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con los proveedores encontrados o un mensaje de error
 */
providerRouter.get('/providers', async (req, res) => {
  try {
    const providers = await Provider.find();
    res.status(200).send(providers);
  } catch (error) {
    res.status(500).send({ msg: 'Error al listar los proveedores', error });
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
      return res.status(200).send(provider);
    } catch (error) {
      return res.status(500).send({ msg: 'Error al buscar el proveedor', error: error });
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