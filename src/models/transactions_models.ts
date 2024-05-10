import { Document, connect, model, Schema } from 'mongoose';
import { Provider } from './providers_models.js';
import { customerModel } from './customers_models.js';
import { muebleModel } from './furnitures_models.js';

// Esquema de la base de datos de proveedores
connect('mongodb://127.0.0.1:27017/providers')
  .then(() => {
    console.log('Conectado a la base de datos');
  })
  .catch(() => {
    console.log('Algo fallo al intentar conectarse a la base de datos de proveedores');
  });

/*
En la ruta /transactions del API, se deberá poder crear, leer, actualizar o borrar transacciones con clientes y/o proveedores.

Una transacción incluye información del cliente/proveedor y de los muebles que se han visto involucrados en la misma, además de otra información como la fecha y hora a la que se llevó a cabo la misma, o el importe asociado a la transacción, que debería autocalcularse. Piense, por tanto, en los campos de información que permiten modelar una transacción. Además, recuerde utilizar operadores y validadores en el esquema correspondiente.

Dado que una transacción se encuentra relacionada, por un lado, con un cliente/proveedor y, por el otro, con un conjunto de muebles, deberá referenciar a los modelos de dichas entidades en el modelo de una transacción.

También tendrá que tener en cuenta situaciones como las siguientes:

    ¿Qué ocurre si un cliente/proveedor o algún mueble especificados en una transacción no existe previamente en la base de datos?
    ¿Qué ocurre con las transacciones de un cliente/proveedor cuándo este último se elimina de la base de datos?
    ¿Debería borrar las transacciones relacionadas con un mueble que deseo borrar de la base de datos?

En esta ruta, la operación de creación de una transacción (una compra de un cliente a la tienda o una venta de un proveedor a la tienda) deberá recibir en el cuerpo de la petición toda la información necesaria, entre la que deberá encontrarse el NIF/CIF del cliente/proveedor, además de un campo con una lista de nombres de muebles y las cantidades de cada uno de ellos. La lógica deberá incorporar todo lo necesario para comprobar que el cliente/proveedor existe previamente. En el caso de una compra por parte de un cliente, también se deberá comprobar que los muebles solicitados existen y que hay stock suficiente de cada uno de ellos. En el caso de una compra por parte de la tienda a un proveedor, se deberá actualizar el stock de los muebles que ya existieran en la base de datos y crear los nuevos muebles en el caso de que no existieran. En ambos casos, además, deberá establecerse la fecha y hora de la transacción, así como calcular el importe asociado a la misma a través del número de unidades especificado para cada mueble involucrado en la transacción. Piense que la lógica de este manejador es compleja. Por lo tanto, trate de agrupar su código en diferentes funciones o métodos para que el mismo sea más legible/mantenible.

La operación de lectura o consulta de transacciones podrá llevarse a cabo de tres maneras diferentes: o bien utilizando una query string que incluya el NIF/CIF del cliente/proveedor, o bien utilizando una query string que incluya las fechas de inicio y fin para las que se quieren obtener las transacciones, además del tipo de transacciones (ventas a clientes, compras a proveedores, o ambas), o bien utilizando el identificador único de la transacción (el asignado por el sistema gestor de base de datos) como parámetro dinámico.

En lo referente a la modificación y borrado de una transacción, solamente se podrán llevar a cabo a través del identificador único de la transacción utilizado como parámetro dinámico. En ambos casos, habrá que actualizar toda la información referente a los muebles involucrados en la transacción. Por ejemplo, al borrar una transacción de una compra de un cliente (una devolución), se deberá actualizar el stock de los muebles involucrados en la misma.

Teniendo en cuenta todo lo anterior, como mínimo, tendrá que escribir un total de seis manejadores diferentes para esta ruta.
*/

/**
 * @brief Esquema de la base de datos de transacciones
 */
export interface TransactionInterface extends Document {
  id: string;
  cliente: typeof customerModel;
  proveedor: typeof Provider;
  muebles: (typeof muebleModel)[];
  fecha: Date;
  importe: number;
}

/**
 * @brief Esquema de la colección de transacciones
 */
export const TransactionSchema = new Schema<TransactionInterface>({
  id: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: (value: string) => {
      if (value.length < 0) {
        throw new Error('El id de la transacción no puede ser vacio');
      }
      if (value.length > 20) {
        throw new Error('El id de la transacción no puede tener mas de 20 caracteres');
      }
    },
  },
  cliente: {
    type: customerModel,
    required: true,
  },
  proveedor: {
    type: Provider,
    required: true,
  },
  muebles: {
    type: [muebleModel],
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  importe: {
    type: Number,
    required: true,
  },
});

// Exportar el modelo de transacciones
export const transactionModel = model<TransactionInterface>('Transaction', TransactionSchema);

/// VENTAS ///
/**
 * @brief Esquema de la base de datos de ventas
 
 */
export interface VentaInterface extends TransactionInterface {}

/**
 * @brief Esquema de la colección de ventas
 */
export const VentaSchema = new Schema<VentaInterface>({});

// Exportar el modelo de ventas
export const ventaModel = model<VentaInterface>('Venta', VentaSchema);

/// COMPRAS ///
/**
 * @brief Esquema de la base de datos de compras
 */
export interface CompraInterface extends TransactionInterface {}

/**
 * @brief Esquema de la colección de compras
 */
export const CompraSchema = new Schema<CompraInterface>({});

// Exportar el modelo de compras
export const compraModel = model<CompraInterface>('Compra', CompraSchema);
