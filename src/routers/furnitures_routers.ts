import express, { Request, Response } from 'express';
import { muebleModel /*FurnitureDocument*/ } from '../models/furnitures_models.js';

interface QueryParams {
  nombre?: string;
  descripcion?: string;
  color?: string;
  // Agregar más campos según sea necesario
}
export const furnitureRouter = express.Router();
furnitureRouter.use(express.json());

// Ruta para crear un nuevo mueble
/**
 * @summary Crea un nuevo mueble
 * @param req Objeto de solicitud HTTP
 * @param res Objeto de respuesta HTTP
 * @returns JSON con el nuevo mueble creado o un error
 */
furnitureRouter.post('/muebles', async (req: Request, res: Response) => {
  try {
    const nuevoMueble = await muebleModel.create(req.body);
    res.status(201).json(nuevoMueble);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para obtener todos los muebles
/**
 * @summary Obtiene todos los muebles
 * @param req Objeto de solicitud HTTP
 * @param res Objeto de respuesta HTTP
 * @returns JSON con todos los muebles o un error
 */
furnitureRouter.get('/muebles', async (req: Request, res: Response) => {
  try {
    const muebles = await muebleModel.find();
    res.json(muebles);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener muebles con parámetros de búsqueda opcionales
/**
 * @summary Obtiene muebles con parámetros de búsqueda opcionales
 * @param req Objeto de solicitud HTTP
 * @param res Objeto de respuesta HTTP
 * @returns JSON con los muebles que coinciden con los parámetros de búsqueda o un error
 */
furnitureRouter.get('/muebles', async (req: Request, res: Response) => {
  try {
    const query: QueryParams = {};

    // Verificar si hay parámetros de consulta y agregarlos a la query
    if (req.query.nombre) {
      query.nombre = req.query.nombre as string;
    }
    if (req.query.descripcion) {
      query.descripcion = req.query.descripcion as string;
    }
    if (req.query.color) {
      query.color = req.query.color as string;
    }
    // Agregar más campos según sea necesario

    const muebles = await muebleModel.find(query);
    res.json(muebles);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener un mueble por su ID
/**
 * @summary Obtiene un mueble por su ID
 * @param req Objeto de solicitud HTTP
 * @param res Objeto de respuesta HTTP
 * @returns JSON con el mueble encontrado o un error si no se encuentra
 */
furnitureRouter.get('/muebles/:id', async (req: Request, res: Response) => {
  try {
    const mueble = await muebleModel.findById(req.params.id);
    if (!mueble) {
      res.status(404).json({ error: 'Mueble no encontrado' });
    } else {
      res.json(mueble);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar un mueble por su ID
/**
 * @summary Actualiza un mueble por su ID
 * @param req Objeto de solicitud HTTP
 * @param res Objeto de respuesta HTTP
 * @returns JSON con el mueble actualizado o un error si no se encuentra
 */
furnitureRouter.put('/muebles/:id', async (req: Request, res: Response) => {
  try {
    const mueble = await muebleModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mueble) {
      res.status(404).json({ error: 'Mueble no encontrado' });
    } else {
      res.json(mueble);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para eliminar un mueble por su ID
/**
 * @summary Elimina un mueble por su ID
 * @param req Objeto de solicitud HTTP
 * @param res Objeto de respuesta HTTP
 * @returns JSON con un mensaje de éxito o un error si no se encuentra el mueble
 */
furnitureRouter.delete('/muebles/:id', async (req: Request, res: Response) => {
  try {
    const mueble = await muebleModel.findByIdAndDelete(req.params.id);
    if (!mueble) {
      res.status(404).json({ error: 'Mueble no encontrado' });
    } else {
      res.json({ message: 'Mueble eliminado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para eliminar un mueble
/**
 * @summary Elimina un mueble
 * @param req Objeto de solicitud HTTP
 * @param res Objeto de respuesta HTTP
 * @returns JSON con un mensaje de éxito o un error si no se encuentra el mueble
 */
furnitureRouter.delete('/muebles', async (req: Request, res: Response) => {
  try {
    const mueble = await muebleModel.deleteMany(req.query);
    if (!mueble) {
      res.status(404).json({ error: 'Mueble no encontrado' });
    } else {
      res.json({ message: 'Mueble eliminado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

