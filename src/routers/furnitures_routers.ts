import express from 'express';
import { Mueble, ColorMueble, TipoMueble, MaterialMueble } from '../models/furnitures_models.js';

export const furnitureRouter = express.Router();
furnitureRouter.use(express.json());

/**
 * Manejador para la creación de un nuevo proveedor
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor creado o un mensaje de error
 */
furnitureRouter.post('/muebles', async (req, res) => {
  const { color, tipo, material } = req.body;

  if (!Object.values(ColorMueble).includes(color)) {
    return res.status(400).send({ error: 'Ese color no está disponible en la tienda' });
  }

  if (!Object.values(TipoMueble).includes(tipo)) {
    return res.status(400).send({ error: 'Ese tipo de mueble no está disponible en la tienda' });
  }

  if (!Object.values(MaterialMueble).includes(material)) {
    return res.status(400).send({ error: 'Ese material no está disponible en la tienda' });
  }

  try {
    const mueble = new Mueble(req.body);
    await mueble.save();
    return res.status(201).send({ message: 'Mueble creado con éxito', mueble });
  } catch (error) {
    return res.status(500).send({ error: 'Error al crear el mueble' });
  }
});

/**
 * Manejador para buscar un mueble en la base de datos a partir de sus atributos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble encontrado o un mensaje de error
 */
furnitureRouter.get('/muebles', async (req, res) => {
  try {
    const muebles = await Mueble.find(req.query);
    if (muebles.length === 0) {
      return res.status(404).send({ message: 'No se encontraron muebles con los criterios de búsqueda proporcionados' });
    }
    return res.status(200).send({ message: 'Búsqueda realizada con éxito', muebles });
  } catch (error) {
    return res.status(500).send({ error: 'Error al realizar la búsqueda' });
  }
});

/**
 * Manejador para buscar un mueble por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble encontrado o un mensaje de error
 */
furnitureRouter.get('/muebles/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const muebles = await Mueble.findById(id);
    if (!muebles) {
      return res.status(404).send({ msg: 'mueble no encontrado' });
    }
    return res.status(200).send({ msg: 'mueble encontrado por id con éxito', muebles: muebles });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al buscar el mueble', error: error });
  }
});

/**
 * Manejador para modificar un mueble en la base de datos a partir de su nombre
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble modificado o un mensaje de error
 */
furnitureRouter.patch('/muebles', async (req, res) => {
  const nombre = req.query.nombre;
  if (!nombre) {
    return res.status(400).send({ message: 'No se proporcionó un nombre' });
  }
  try {
    const muebleActualizado = await Mueble.findOneAndUpdate({ nombre: nombre }, req.body, { new: true });
    if (!muebleActualizado) {
      return res.status(404).send({ message: 'Mueble no encontrado para modificar' });
    }
    return res.status(200).send({ message: 'Mueble modificado con éxito', mueble: muebleActualizado });
  } catch (error) {
    return res.status(500).send({ error: 'Error al modificar el mueble' });
  }
});

/**
 * Manejador para modificar un mueble por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble modificado o un mensaje de error
 */
furnitureRouter.patch('/muebles/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const mueble = await Mueble.findByIdAndUpdate(id, req.body, { new: true });
    if (!mueble) {
      return res.status(404).send({ msg: 'Mueble no encontrado para modificar' });
    }
    return res.status(200).send({ msg: 'Mueble modificado por id con éxito', mueble: mueble });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al modificar el mueble', error: error });
  }
});

/**
 * Manejador para eliminar un mueble en la base de datos a partir de su nombre
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con un mensaje de éxito o de error
 */
furnitureRouter.delete('/muebles', async (req, res) => {
  const nombre = req.query.nombre;
  if (!nombre) {
    return res.status(400).send({ message: 'No se proporcionó un nombre' });
  }
  try {
    const muebleEliminado = await Mueble.findOneAndDelete({ nombre: nombre });
    if (!muebleEliminado) {
      return res.status(404).send({ message: 'Mueble no encontrado para eliminar' });
    }
    return res.status(200).send({ message: 'Mueble eliminado con éxito' });
  } catch (error) {
    return res.status(500).send({ error: 'Error al eliminar el mueble' });
  }
});

/**
 * Manejador para eliminar un mueble por su identificador único
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con un mensaje de éxito o de error
 */
furnitureRouter.delete('/muebles/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const muebleEliminado = await Mueble.findByIdAndDelete(id);
    if (!muebleEliminado) {
      return res.status(404).send({ msg: 'Mueble no encontrado para eliminar' });
    }
    return res.status(200).send({ msg: 'Mueble eliminado por id con éxito' });
  } catch (error) {
    return res.status(500).send({ msg: 'Error al eliminar el mueble', error: error });
  }
});