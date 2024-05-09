import express from 'express';
import './db/mongoose.js';
//import { transactionModel, VentaSchema, ventaModel, CompraInterface, compraModel, CompraSchema } from '../models/transactions_models.js';

export const transactionRouter = express.Router();
transactionRouter.use(express.json());

// Ruta para obtener transacciones con parámetros de búsqueda opcionales
/**
 * @summary Obtiene transacciones con parámetros de búsqueda opcionales
 * @param req Objeto de solicitud HTTP
 * @param res Objeto de respuesta HTTP
 * @returns JSON con las transacciones que coinciden con los parámetros de búsqueda o un error
 */
/*
furnitureRouter.get('/transactions', async (req: Request, res: Response) => {
    try {
      const query: any = {};
  
      // Verificar si hay parámetros de consulta y agregarlos a la query
      if (req.query.cliente) {
        query.cliente = req.query.cliente;
      }
      if (req.query.proveedor) {
        query.proveedor = req.query.proveedor;
      }
      if (req.query.fechaInicio && req.query.fechaFin) {
        query.fecha = {
          $gte: new Date(req.query.fechaInicio),
          $lte: new Date(req.query.fechaFin),
        };
      }
      // Agregar más campos según sea necesario
  
      const transactions = await transactionModel.find(query);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Ruta para obtener una transacción por su ID
  /**
   * @summary Obtiene una transacción por su ID
   * @param req Objeto de solicitud HTTP
   * @param res Objeto de respuesta HTTP
   * @returns JSON con la transacción encontrada o un error si no se encuentra
   */
  /*
  furnitureRouter.get('/transactions/:id', async (req: Request, res: Response) => {
    try {
      const transaction = await transactionModel.findById(req.params.id);
      if (!transaction) {
        res.status(404).json({ error: 'Transacción no encontrada' });
      } else {
        res.json(transaction);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  // Ruta para actualizar una transacción por su ID
  /**
   * @summary Actualiza una transacción por su ID
   * @param req Objeto de solicitud HTTP
   * @param res Objeto de respuesta HTTP
   * @returns JSON con la transacción actualizada o un error si no se encuentra
   */
  /*
  furnitureRouter.put('/transactions/:id', async (req: Request, res: Response) => {
    try {
      const transaction = await transactionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!transaction) {
        res.status(404).json({ error: 'Transacción no encontrada' });
      } else {
        res.json(transaction);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });   
  // Ruta para eliminar una transacción por su ID
  /**
   * @summary Elimina una transacción por su ID
   * @param req Objeto de solicitud HTTP
   * @param res Objeto de respuesta HTTP
   * @returns JSON con un mensaje de éxito o un error si no se encuentra la transacción
   */
  /*
  furnitureRouter.delete('/transactions/:id', async (req: Request, res: Response) => {
    try {
      const transaction = await transactionModel.findByIdAndDelete(req.params.id);
      if (!transaction) {
        res.status(404).json({ error: 'Transacción no encontrada' });
      } else {
        res.json({ message: 'Transacción eliminada exitosamente' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
   */